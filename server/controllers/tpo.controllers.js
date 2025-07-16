import db from '../db/connection.js';

export const getTPO = (req, res) => {
  db.query('SELECT * FROM tpo_details', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

export const addTPO = (req, res) => {
  const { name, college, email, contact_no } = req.body;
  // Check if email already exists
  db.query('SELECT id FROM tpo_details WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length > 0) {
      return res.status(409).json({ message: 'A TPO with this email already exists.' });
    }
    // Insert new TPO
    db.query(
      'INSERT INTO tpo_details (name, college, email, contact_no) VALUES (?, ?, ?, ?)',
      [name, college, email, contact_no],
      (err, result) => {
        if (err) {
          // Handle duplicate error from DB unique constraint
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'A TPO with this email already exists.' });
          }
          return res.status(500).json({ error: err });
        }
        res.status(201).json({ message: 'Data added successfully', id: result.insertId });
      }
    );
  });
};

export const updateTPO = (req, res) => {
  const { id } = req.params;
  const { name, college, email, contact_no } = req.body;
  db.query(
    'UPDATE tpo_details SET name = ?, college = ?, email = ?, contact_no = ? WHERE id = ?',
    [name, college, email, contact_no, id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Data updated successfully' });
    }
  );
}

export const deleteTPO = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM tpo_details WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Data deleted successfully' });
  });
}
