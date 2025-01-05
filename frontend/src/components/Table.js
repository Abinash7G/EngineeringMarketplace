import React from "react";

const Table = () => {
  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>John Doe</td>
          <td>johndoe@example.com</td>
          <td>Client</td>
          <td>
            <button style={styles.actionButton}>Edit</button>
            <button style={styles.actionButton}>Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const styles = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  actionButton: {
    padding: "5px 10px",
    margin: "0 5px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#007bff",
    color: "white",
    cursor: "pointer",
  },
};

export default Table;
