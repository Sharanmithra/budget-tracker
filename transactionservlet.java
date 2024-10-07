import javax.servlet.*;
import javax.servlet.http.*;
import java.io.*;
import java.sql.SQLException;

public class TransactionServlet extends HttpServlet {
    private Database database;

    public void init() {
        database = new Database();
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Parse JSON request
        BufferedReader reader = request.getReader();
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }
        String json = sb.toString();

        // Assume you have a method to parse the JSON to a Transaction object
        Transaction transaction = parseJsonToTransaction(json);

        try {
            // Add transaction to DB
            database.addTransaction(transaction.getId(), transaction.getName(), transaction.getAmount(), transaction.getType());
            response.setStatus(HttpServletResponse.SC_OK);
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            e.printStackTrace();
        }
    }

    // Similarly, handle GET and DELETE requests to retrieve and delete transactions
}
