import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class Database {
    private static final String URL = "jdbc:mysql://localhost:3306/expense_tracker";
    private static final String USER = "root";  // Change to your username
    private static final String PASSWORD = "";  // Change to your password

    public Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }

    // Add a transaction to the database
    public void addTransaction(int id, String name, double amount, String type) throws SQLException {
        String query = "INSERT INTO transactions (id, name, amount, type) VALUES (?, ?, ?, ?)";
        try (Connection connection = getConnection(); PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setInt(1, id);
            statement.setString(2, name);
            statement.setDouble(3, amount);
            statement.setString(4, type);
            statement.executeUpdate();
        }
    }

    // Get all transactions from the database
    public List<Transaction> getTransactions() throws SQLException {
        List<Transaction> transactions = new ArrayList<>();
        String query = "SELECT * FROM transactions";
        try (Connection connection = getConnection(); PreparedStatement statement = connection.prepareStatement(query)) {
            ResultSet rs = statement.executeQuery();
            while (rs.next()) {
                Transaction transaction = new Transaction(rs.getInt("id"), rs.getString("name"), rs.getDouble("amount"), rs.getString("type"));
                transactions.add(transaction);
            }
        }
        return transactions;
    }

    // Delete a transaction by ID
    public void deleteTransaction(int id) throws SQLException {
        String query = "DELETE FROM transactions WHERE id = ?";
        try (Connection connection = getConnection(); PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setInt(1, id);
            statement.executeUpdate();
        }
    }

    // Clear all transactions
    public void clearAllTransactions() throws SQLException {
        String query = "DELETE FROM transactions";
        try (Connection connection = getConnection(); PreparedStatement statement = connection.prepareStatement(query)) {
            statement.executeUpdate();
        }
    }
}
