const db = require('../config/db');

class Order {
  static async getAll(options = {}) {
    try {
      let query = `
        SELECT o.*, u.username, u.name as user_name
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        WHERE 1=1
      `;

      const params = [];

      if (options.status) {
        query += ' AND o.status = ?';
        params.push(options.status);
      }

      if (options.startDate) {
        query += ' AND DATE(o.created_at) >= ?';
        params.push(options.startDate);
      }

      if (options.endDate) {
        query += ' AND DATE(o.created_at) <= ?';
        params.push(options.endDate);
      }

      if (options.search) {
        query +=
          ' AND (o.order_number LIKE ? OR u.username LIKE ? OR u.name LIKE ? OR o.phone LIKE ?)';
        const searchTerm = `%${options.search}%`;
        params.push(searchTerm, searchTerm, searchTerm, searchTerm);
      }

      query += ' ORDER BY o.created_at DESC';

      // 分页
      const page = parseInt(options.page) || 1;
      const limit = parseInt(options.limit) || 10;
      const offset = (page - 1) * limit;

      // 获取总数
      const [countResult] = await db.query(
        `SELECT COUNT(*) as total FROM orders o 
         LEFT JOIN users u ON o.user_id = u.id
         WHERE 1=1 ${options.status ? ' AND o.status = ?' : ''} ${
          options.startDate ? ' AND DATE(o.created_at) >= ?' : ''
        } ${options.endDate ? ' AND DATE(o.created_at) <= ?' : ''} ${
          options.search
            ? ' AND (o.order_number LIKE ? OR u.username LIKE ? OR u.name LIKE ? OR o.phone LIKE ?)'
            : ''
        }`,
        params
      );

      query += ' LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const [rows] = await db.query(query, params);

      return {
        total: countResult[0].total,
        page,
        limit,
        items: rows,
      };
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      // 获取订单信息
      const [orderRows] = await db.query(
        `SELECT o.*, u.username, u.name as user_name
         FROM orders o
         LEFT JOIN users u ON o.user_id = u.id
         WHERE o.id = ?`,
        [id]
      );

      if (orderRows.length === 0) {
        return null;
      }

      // 获取订单项
      const [itemRows] = await db.query(
        `SELECT oi.*, mi.image 
         FROM order_items oi
         LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
         WHERE oi.order_id = ?`,
        [id]
      );

      return {
        order: orderRows[0],
        items: itemRows,
      };
    } catch (error) {
      throw error;
    }
  }

  static async create(orderData) {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // 生成订单号
      const date = new Date();
      const orderNumber = `ORD${date.getFullYear()}${String(date.getMonth() + 1).padStart(
        2,
        '0'
      )}${String(date.getDate()).padStart(2, '0')}${String(
        Math.floor(Math.random() * 1000)
      ).padStart(3, '0')}`;

      // 创建订单
      const [orderResult] = await connection.query(
        `INSERT INTO orders (order_number, user_id, total_amount, status, payment_status, payment_method, address, phone, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderNumber,
          orderData.user_id,
          orderData.total_amount,
          'pending',
          'unpaid',
          orderData.payment_method || null,
          orderData.address || null,
          orderData.phone || null,
          orderData.notes || null,
        ]
      );

      const orderId = orderResult.insertId;

      // 创建订单项
      for (const item of orderData.items) {
        // 获取菜单项名称
        const [menuItemRows] = await connection.query('SELECT name FROM menu_items WHERE id = ?', [
          item.menu_id,
        ]);

        const menuItemName = menuItemRows.length > 0 ? menuItemRows[0].name : '未知菜品';

        await connection.query(
          `INSERT INTO order_items (order_id, menu_item_id, menu_item_name, quantity, unit_price, subtotal, notes)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            orderId,
            item.menu_id,
            menuItemName,
            item.quantity,
            item.price,
            item.quantity * item.price,
            item.notes || null,
          ]
        );
      }

      await connection.commit();

      // 获取创建的订单
      const [orderRows] = await connection.query('SELECT * FROM orders WHERE id = ?', [orderId]);

      return orderRows[0];
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async update(id, orderData) {
    try {
      let query = 'UPDATE orders SET ';
      const params = [];
      const updateFields = [];

      if (orderData.status !== undefined) {
        updateFields.push('status = ?');
        params.push(orderData.status);
      }

      if (orderData.payment_status !== undefined) {
        updateFields.push('payment_status = ?');
        params.push(orderData.payment_status);
      }

      if (orderData.payment_method !== undefined) {
        updateFields.push('payment_method = ?');
        params.push(orderData.payment_method);
      }

      if (orderData.address !== undefined) {
        updateFields.push('address = ?');
        params.push(orderData.address);
      }

      if (orderData.phone !== undefined) {
        updateFields.push('phone = ?');
        params.push(orderData.phone);
      }

      if (orderData.notes !== undefined) {
        updateFields.push('notes = ?');
        params.push(orderData.notes);
      }

      if (updateFields.length === 0) {
        throw new Error('没有提供要更新的字段');
      }

      query += updateFields.join(', ');
      query += ' WHERE id = ?';
      params.push(id);

      await db.query(query, params);

      const [updatedOrder] = await db.query(
        `SELECT o.*, u.username, u.name as user_name
         FROM orders o
         LEFT JOIN users u ON o.user_id = u.id
         WHERE o.id = ?`,
        [id]
      );

      return updatedOrder[0];
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // 删除订单项
      await connection.query('DELETE FROM order_items WHERE order_id = ?', [id]);

      // 删除订单
      await connection.query('DELETE FROM orders WHERE id = ?', [id]);

      await connection.commit();

      return id;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async getStats(options = {}) {
    try {
      let whereClause = '1=1';
      const params = [];

      if (options.startDate) {
        whereClause += ' AND DATE(created_at) >= ?';
        params.push(options.startDate);
      }

      if (options.endDate) {
        whereClause += ' AND DATE(created_at) <= ?';
        params.push(options.endDate);
      }

      // 获取订单总数和销售总额
      const [totalResult] = await db.query(
        `SELECT COUNT(*) as totalOrders, SUM(total_amount) as totalSales
         FROM orders
         WHERE ${whereClause}`,
        params
      );

      // 获取各状态订单数量
      const [statusResult] = await db.query(
        `SELECT status, COUNT(*) as count
         FROM orders
         WHERE ${whereClause}
         GROUP BY status`,
        params
      );

      // 获取各支付状态订单数量
      const [paymentStatusResult] = await db.query(
        `SELECT payment_status, COUNT(*) as count
         FROM orders
         WHERE ${whereClause}
         GROUP BY payment_status`,
        params
      );

      // 格式化状态计数
      const statusCounts = {
        pending: 0,
        processing: 0,
        completed: 0,
        cancelled: 0,
      };

      statusResult.forEach((item) => {
        statusCounts[item.status] = item.count;
      });

      // 格式化支付状态计数
      const paymentStatusCounts = {
        paid: 0,
        unpaid: 0,
        refunded: 0,
      };

      paymentStatusResult.forEach((item) => {
        paymentStatusCounts[item.payment_status] = item.count;
      });

      return {
        totalOrders: totalResult[0].totalOrders || 0,
        totalSales: totalResult[0].totalSales || 0,
        statusCounts,
        paymentStatusCounts,
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Order;
