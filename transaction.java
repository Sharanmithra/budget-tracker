public class Transaction {
    private int id;
    private String name;
    private double amount;
    private String type;

    public Transaction(int id, String name, double amount, String type) {
        this.id = id;
        this.name = name;
        this.amount = amount;
        this.type = type;
    }

    public int getId() { return id; }
    public String getName() { return name; }
    public double getAmount() { return amount; }
    public String getType() { return type; }

    // Add getter and setter methods if needed
}

