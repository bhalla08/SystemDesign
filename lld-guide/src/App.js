import { useState, useMemo } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const topics = [
  // ── OOP ──
  {
    id: "oop-class-object",
    group: "OOP Concepts",
    title: "Class & Object",
    icon: "◈",
    tldr: "A class is a blueprint; an object is a real instance built from that blueprint.",
    notes: `A **class** defines the structure and behaviour (fields + methods) that its objects will have.
An **object** is a concrete instance of a class, allocated in memory at runtime.

Key points:
• A class is defined once; you can create unlimited objects from it.
• Each object has its own copy of instance variables (fields).
• Static members belong to the class, not to any specific object.
• The \`new\` keyword allocates memory and calls the constructor.`,
    diagram: `Class (Blueprint)
┌──────────────────┐
│   Car            │
├──────────────────┤
│ - brand: String  │  ← Fields (state)
│ - speed: int     │
├──────────────────┤
│ + accelerate()   │  ← Methods (behaviour)
│ + brake()        │
└──────────────────┘
        │  instantiate
        ▼
Object (Instance)
┌──────────────────┐
│ brand = "Toyota" │
│ speed = 60       │
└──────────────────┘`,
    code: `// Class definition
public class Car {
    private String brand;   // field
    private int speed;

    // Constructor
    public Car(String brand) {
        this.brand = brand;
        this.speed = 0;
    }

    // Method
    public void accelerate(int amount) {
        this.speed += amount;
    }

    public void printInfo() {
        System.out.println(brand + " going " + speed + " km/h");
    }
}

// Creating objects
public class Main {
    public static void main(String[] args) {
        Car car1 = new Car("Toyota");  // object 1
        Car car2 = new Car("BMW");     // object 2

        car1.accelerate(60);
        car1.printInfo();  // Toyota going 60 km/h
        car2.printInfo();  // BMW going 0 km/h
    }
}`,
  },
  {
    id: "oop-encapsulation",
    group: "OOP Concepts",
    title: "Encapsulation",
    icon: "⬡",
    tldr: "Bundle data + methods together and restrict direct access to internals.",
    notes: `**Encapsulation** means hiding the internal state of an object and only exposing a controlled interface.

Why it matters:
• Prevents outside code from putting an object in an invalid state.
• You can change the internal implementation without breaking callers.
• Achieved in Java by making fields \`private\` and providing \`public\` getters/setters.

Rule of thumb: expose *what* an object can do, hide *how* it does it.`,
    diagram: `┌─────────────────────────────┐
│         BankAccount         │
├─────────────────────────────┤
│ 🔒 - balance: double        │  ← private (hidden)
├─────────────────────────────┤
│ ✅ + deposit(amount)        │  ← public interface
│ ✅ + withdraw(amount)       │
│ ✅ + getBalance()           │
└─────────────────────────────┘
External code can only use ✅ methods.
Direct access to 🔒 balance is blocked.`,
    code: `public class BankAccount {
    private double balance;  // hidden from outside

    public BankAccount(double initialBalance) {
        if (initialBalance < 0) throw new IllegalArgumentException("Negative balance");
        this.balance = initialBalance;
    }

    // Controlled setter — validates before changing state
    public void deposit(double amount) {
        if (amount <= 0) throw new IllegalArgumentException("Amount must be positive");
        balance += amount;
    }

    public void withdraw(double amount) {
        if (amount > balance) throw new IllegalStateException("Insufficient funds");
        balance -= amount;
    }

    public double getBalance() {   // read-only getter
        return balance;
    }
}

// Usage
BankAccount acc = new BankAccount(1000);
acc.deposit(500);
acc.withdraw(200);
System.out.println(acc.getBalance());   // 1300.0
// acc.balance = -999;  ← compile error! field is private`,
  },
  {
    id: "oop-inheritance",
    group: "OOP Concepts",
    title: "Inheritance",
    icon: "⬆",
    tldr: "A child class acquires the fields and methods of its parent class.",
    notes: `**Inheritance** allows a class (child/subclass) to reuse and extend the behaviour of another class (parent/superclass).

Key points:
• Use the \`extends\` keyword in Java.
• The child inherits all \`public\` and \`protected\` members of the parent.
• The child can **override** parent methods to provide specialised behaviour.
• \`super\` refers to the parent — used to call parent constructor or methods.
• Java supports **single inheritance** for classes (a class can extend only one class).
• Prefer inheritance only when there is a true "is-a" relationship.`,
    diagram: `        Animal
    ┌────────────┐
    │ + eat()    │
    │ + sleep()  │
    └────────────┘
         ▲
    ┌────┴────┐
    │         │
   Dog       Cat
+ bark()   + meow()
(inherits eat, sleep)`,
    code: `// Parent class
public class Animal {
    protected String name;

    public Animal(String name) {
        this.name = name;
    }

    public void eat() {
        System.out.println(name + " is eating");
    }

    public void sleep() {
        System.out.println(name + " is sleeping");
    }
}

// Child class — inherits Animal, adds bark()
public class Dog extends Animal {
    public Dog(String name) {
        super(name);   // calls Animal's constructor
    }

    public void bark() {
        System.out.println(name + " says: Woof!");
    }

    @Override
    public void eat() {
        System.out.println(name + " is eating dog food");  // specialised
    }
}

// Usage
Dog dog = new Dog("Rex");
dog.eat();    // Rex is eating dog food  (overridden)
dog.sleep();  // Rex is sleeping         (inherited)
dog.bark();   // Rex says: Woof!         (own method)`,
  },
  {
    id: "oop-polymorphism",
    group: "OOP Concepts",
    title: "Polymorphism",
    icon: "⬡",
    tldr: "One interface, many forms — the same method call behaves differently based on the actual object.",
    notes: `**Polymorphism** lets you write code against a general type while actual behaviour depends on the specific object at runtime.

Two types:
1. **Compile-time (Method Overloading)** — same method name, different parameter lists. Resolved at compile time.
2. **Runtime (Method Overriding)** — subclass overrides parent method. Resolved at runtime via dynamic dispatch.

Why it matters:
• Enables writing generic code (e.g. a loop over \`List<Shape>\`) that works for all subtypes.
• Reduces if/else chains — adding a new subtype doesn't require changing existing code.`,
    diagram: `Shape (parent)
└── draw()

   ┌──────────┬──────────┐
Circle      Rect      Triangle
draw()      draw()    draw()

Shape s = new Circle();
s.draw();  →  Circle's draw() is called  (runtime decision)`,
    code: `// Runtime Polymorphism
abstract class Shape {
    abstract void draw();
}

class Circle extends Shape {
    @Override
    public void draw() { System.out.println("Drawing Circle"); }
}

class Rectangle extends Shape {
    @Override
    public void draw() { System.out.println("Drawing Rectangle"); }
}

// Generic code — works for any Shape
public class Main {
    public static void main(String[] args) {
        List<Shape> shapes = List.of(new Circle(), new Rectangle(), new Circle());

        for (Shape s : shapes) {
            s.draw();   // correct draw() called automatically
        }
    }
}

// Compile-time Polymorphism (Overloading)
class Printer {
    void print(int n)    { System.out.println("int: " + n); }
    void print(String s) { System.out.println("String: " + s); }
    void print(int a, int b) { System.out.println("sum: " + (a+b)); }
}`,
  },
  {
    id: "oop-abstraction",
    group: "OOP Concepts",
    title: "Abstraction",
    icon: "◻",
    tldr: "Show only what is necessary; hide the complex implementation details.",
    notes: `**Abstraction** means exposing a simplified model of something complex.

In Java, achieved via:
1. **Abstract classes** — can have both abstract methods (no body) and concrete methods.
2. **Interfaces** — 100% abstract contract (all methods are implicitly abstract, unless \`default\`).

Key difference from Encapsulation:
• Encapsulation = *hiding data* (fields)
• Abstraction = *hiding implementation* (how methods work internally)

Real-world analogy: You drive a car using the steering wheel and pedals — you don't need to know how the engine combustion works.`,
    diagram: `<<interface>>
    Payment
  + pay(amount)      ← abstract contract

     ▲         ▲
     │         │
CreditCard   UPI
 pay()       pay()
(own impl)  (own impl)

Caller only knows "Payment", not the concrete type.`,
    code: `// Interface = pure abstraction
interface Payment {
    void pay(double amount);
    default void printReceipt() {
        System.out.println("Payment successful");
    }
}

class CreditCard implements Payment {
    @Override
    public void pay(double amount) {
        System.out.println("Charging ₹" + amount + " to credit card");
    }
}

class UPI implements Payment {
    @Override
    public void pay(double amount) {
        System.out.println("Sending ₹" + amount + " via UPI");
    }
}

// Caller doesn't care about the implementation
public class Checkout {
    public void process(Payment payment, double amount) {
        payment.pay(amount);
        payment.printReceipt();
    }

    public static void main(String[] args) {
        Checkout c = new Checkout();
        c.process(new CreditCard(), 999.0);
        c.process(new UPI(), 499.0);
    }
}`,
  },

  // ── SOLID ──
  {
    id: "solid-srp",
    group: "SOLID Principles",
    title: "S — Single Responsibility",
    icon: "①",
    tldr: "A class should have one — and only one — reason to change.",
    notes: `**SRP** states that every class should be responsible for exactly one part of the system's functionality.

"Reason to change" = the actor/stakeholder whose requirements would cause the class to change.

Bad signs (violations):
• A class that handles both business logic AND database queries.
• A class that formats data AND sends emails.

Benefits:
• Smaller, focused classes are easier to understand, test, and modify.
• Changes to one responsibility don't accidentally break another.`,
    diagram: `❌ BAD — One class, multiple responsibilities
┌──────────────────────────────┐
│         Invoice              │
│ + calculateTotal()  ← logic  │
│ + printInvoice()    ← UI     │
│ + saveToDatabase()  ← DB     │
└──────────────────────────────┘

✅ GOOD — Split responsibilities
┌──────────────┐  ┌─────────────────┐  ┌──────────────────┐
│   Invoice    │  │  InvoicePrinter │  │  InvoiceRepository│
│ + calcTotal()│  │ + print()       │  │ + save()         │
└──────────────┘  └─────────────────┘  └──────────────────┘`,
    code: `// ❌ Violation
class Invoice {
    double calculateTotal() { /* business logic */ return 0; }
    void printInvoice()     { /* printing logic  */ }
    void saveToDatabase()   { /* DB logic        */ }
}

// ✅ SRP applied — each class has ONE job
class Invoice {
    private List<Item> items;
    double calculateTotal() {
        return items.stream().mapToDouble(i -> i.price * i.qty).sum();
    }
}

class InvoicePrinter {
    void print(Invoice inv) {
        System.out.println("Total: " + inv.calculateTotal());
    }
}

class InvoiceRepository {
    void save(Invoice inv) {
        // persist to database
    }
}`,
  },
  {
    id: "solid-ocp",
    group: "SOLID Principles",
    title: "O — Open/Closed",
    icon: "②",
    tldr: "Open for extension, closed for modification.",
    notes: `**OCP** means you should be able to add new behaviour without editing existing, tested code.

How to achieve it:
• Program to abstractions (interfaces / abstract classes).
• New behaviour = new class that implements the abstraction.
• Existing code stays untouched → no regression risk.

Classic trigger: you find yourself adding \`if (type == X)\` branches to an existing class — that's an OCP violation waiting to happen.`,
    diagram: `❌ BAD — Adding new shape requires editing existing class
AreaCalculator.calculate(shape):
  if shape == "circle" → ...
  if shape == "rect"   → ...   ← must edit this class every time

✅ GOOD — New shape = new class, calculator unchanged
<<interface>> Shape
    + area(): double
      ▲         ▲        ▲
   Circle     Rect    Triangle   ← extend without modifying`,
    code: `// ❌ Violation — must edit AreaCalculator for every new shape
class AreaCalculator {
    double calculate(Object shape) {
        if (shape instanceof Circle c)    return Math.PI * c.r * c.r;
        if (shape instanceof Rect r)      return r.w * r.h;
        // Adding Triangle? Edit this class again ← BAD
        return 0;
    }
}

// ✅ OCP — add Triangle without touching AreaCalculator
interface Shape {
    double area();
}

class Circle implements Shape {
    double r;
    public double area() { return Math.PI * r * r; }
}

class Rect implements Shape {
    double w, h;
    public double area() { return w * h; }
}

class Triangle implements Shape {   // NEW — no existing code touched
    double base, height;
    public double area() { return 0.5 * base * height; }
}

class AreaCalculator {
    double calculate(Shape shape) { return shape.area(); }  // never changes
}`,
  },
  {
    id: "solid-lsp",
    group: "SOLID Principles",
    title: "L — Liskov Substitution",
    icon: "③",
    tldr: "Subclasses must be substitutable for their parent without breaking the program.",
    notes: `**LSP** (Barbara Liskov, 1987): If S is a subtype of T, then objects of type T may be replaced with objects of type S without altering the correctness of the program.

In plain terms: anywhere you use a \`Bird\` reference, you should be able to pass a \`Sparrow\` or \`Eagle\` and things should still work correctly.

Common violation: A subclass overrides a method by throwing an exception or doing nothing — this breaks the contract the parent established.

Checklist:
• Subclass should not strengthen preconditions.
• Subclass should not weaken postconditions.
• Subclass should not throw new unexpected exceptions.`,
    diagram: `❌ BAD
Bird → fly()
  └── Penguin → fly() throws Exception!   ← breaks substitution

✅ GOOD — Separate what penguins can't do
     Bird
   + eat()
   + sleep()
      ▲         ▲
  FlyingBird  Penguin
  + fly()     (no fly)
      ▲
   Sparrow`,
    code: `// ❌ LSP Violation
class Bird {
    public void fly() { System.out.println("Flying..."); }
}

class Penguin extends Bird {
    @Override
    public void fly() {
        throw new UnsupportedOperationException("Penguins can't fly!");
        // Caller expecting Bird.fly() to work — gets an exception instead
    }
}

// ✅ LSP respected — restructure hierarchy
abstract class Bird {
    abstract void eat();
}

abstract class FlyingBird extends Bird {
    abstract void fly();
}

class Sparrow extends FlyingBird {
    public void eat()  { System.out.println("Sparrow eating"); }
    public void fly()  { System.out.println("Sparrow flying"); }
}

class Penguin extends Bird {
    public void eat()  { System.out.println("Penguin eating"); }
    public void swim() { System.out.println("Penguin swimming"); }
    // No fly() — doesn't violate any contract
}`,
  },
  {
    id: "solid-isp",
    group: "SOLID Principles",
    title: "I — Interface Segregation",
    icon: "④",
    tldr: "Don't force a class to implement methods it doesn't need.",
    notes: `**ISP** says large, fat interfaces should be split into smaller, focused ones. Clients should only depend on the methods they actually use.

Violation sign: a class implements an interface but leaves some methods empty or throws \`UnsupportedOperationException\` — that class is being forced to depend on methods it doesn't use.

Solution: break the fat interface into role-specific interfaces. A class can implement multiple focused interfaces.`,
    diagram: `❌ FAT interface
<<interface>> Worker
+ work()
+ eat()
+ sleep()

RobotWorker implements Worker:
  eat()  → ??? robots don't eat  ← forced to implement

✅ SEGREGATED
<<interface>>    <<interface>>
  Workable         Eatable
  + work()         + eat()

Human implements Workable, Eatable  ✅
Robot implements Workable           ✅`,
    code: `// ❌ Fat interface — Robot forced to implement eat()
interface Worker {
    void work();
    void eat();
    void sleep();
}

class Robot implements Worker {
    public void work()  { System.out.println("Robot working"); }
    public void eat()   { throw new UnsupportedOperationException(); } // ← forced!
    public void sleep() { throw new UnsupportedOperationException(); } // ← forced!
}

// ✅ ISP — segregated interfaces
interface Workable  { void work(); }
interface Eatable   { void eat(); }
interface Sleepable { void sleep(); }

class Human implements Workable, Eatable, Sleepable {
    public void work()  { System.out.println("Human working"); }
    public void eat()   { System.out.println("Human eating"); }
    public void sleep() { System.out.println("Human sleeping"); }
}

class Robot implements Workable {
    public void work() { System.out.println("Robot working"); }
    // Doesn't need eat() or sleep() — no forced empty methods
}`,
  },
  {
    id: "solid-dip",
    group: "SOLID Principles",
    title: "D — Dependency Inversion",
    icon: "⑤",
    tldr: "Depend on abstractions, not concrete implementations.",
    notes: `**DIP** has two rules:
1. High-level modules should not depend on low-level modules. Both should depend on abstractions.
2. Abstractions should not depend on details. Details should depend on abstractions.

In practice: instead of \`new MySQLDatabase()\` inside your service class, inject a \`Database\` interface. The service doesn't know (or care) which DB is used.

This is the foundation of **Dependency Injection** frameworks (Spring, etc.).

Benefits:
• Swap implementations easily (MySQL → PostgreSQL, or mock in tests).
• High-level business logic is decoupled from low-level infrastructure.`,
    diagram: `❌ BAD — high level depends on low level
OrderService ──depends on──▶ MySQLDatabase (concrete)

✅ GOOD — both depend on abstraction
OrderService ──depends on──▶ <<interface>> Database
                                     ▲          ▲
                               MySQLDatabase  MongoDatabase`,
    code: `// ❌ DIP Violation — OrderService is tightly coupled to MySQL
class MySQLDatabase {
    public void save(Order o) { /* MySQL specific */ }
}

class OrderService {
    private MySQLDatabase db = new MySQLDatabase(); // ← concrete dependency!
    public void placeOrder(Order o) { db.save(o); }
}

// ✅ DIP applied
interface Database {
    void save(Order o);
}

class MySQLDatabase implements Database {
    public void save(Order o) { System.out.println("Saved to MySQL"); }
}

class MongoDatabase implements Database {
    public void save(Order o) { System.out.println("Saved to MongoDB"); }
}

class OrderService {
    private final Database db;  // depends on abstraction

    // Dependency injected from outside
    public OrderService(Database db) { this.db = db; }

    public void placeOrder(Order o) { db.save(o); }
}

// Wiring (can be done by Spring, or manually)
Database db = new MySQLDatabase();
OrderService service = new OrderService(db);`,
  },

  // ── DESIGN PATTERNS ──
  {
    id: "dp-singleton",
    group: "Design Patterns · Creational",
    title: "Singleton",
    icon: "◉",
    tldr: "Ensure a class has only one instance, and provide a global access point to it.",
    notes: `**Singleton** restricts instantiation of a class to a single object. Useful when exactly one object is needed to coordinate across the system.

Common use cases: Logger, Configuration manager, Database connection pool, Thread pool.

Implementation variants in Java:
1. **Eager initialisation** — instance created at class load time.
2. **Lazy initialisation** — instance created on first use.
3. **Thread-safe (double-checked locking)** — safe for multi-threaded environments.
4. **Enum Singleton** — simplest, thread-safe, handles serialisation.

Caution: Overusing Singleton introduces global state, making code harder to test.`,
    diagram: `┌──────────────────────────────┐
│         Logger               │
├──────────────────────────────┤
│ - instance: Logger  (static) │
├──────────────────────────────┤
│ - Logger()          (private)│  ← blocks new Logger()
│ + getInstance(): Logger      │  ← only way to get it
│ + log(msg)                   │
└──────────────────────────────┘`,
    code: `// Thread-safe Singleton using double-checked locking
public class Logger {
    private static volatile Logger instance;  // volatile ensures visibility

    private Logger() {}   // private constructor

    public static Logger getInstance() {
        if (instance == null) {                    // first check (no lock)
            synchronized (Logger.class) {
                if (instance == null) {            // second check (with lock)
                    instance = new Logger();
                }
            }
        }
        return instance;
    }

    public void log(String message) {
        System.out.println("[LOG] " + message);
    }
}

// Usage — always the same object
Logger.getInstance().log("App started");
Logger.getInstance().log("User logged in");

// --- Simplest alternative: Enum Singleton ---
public enum ConfigManager {
    INSTANCE;
    private String dbUrl = "jdbc:mysql://localhost/mydb";
    public String getDbUrl() { return dbUrl; }
}
// ConfigManager.INSTANCE.getDbUrl()`,
  },
  {
    id: "dp-factory",
    group: "Design Patterns · Creational",
    title: "Factory Method",
    icon: "⚙",
    tldr: "Define an interface for creating an object, but let subclasses decide which class to instantiate.",
    notes: `**Factory Method** delegates the creation of objects to subclasses. The parent class defines *when* to create an object, the subclass decides *what* to create.

When to use:
• You don't know ahead of time what class you need to instantiate.
• You want subclasses to control what gets created.
• Creating objects is complex and you want to centralise that logic.

Difference from Abstract Factory:
• Factory Method creates one product.
• Abstract Factory creates families of related products.`,
    diagram: `<<abstract>> Notification
+ send(msg)          ← uses product
+ createNotifier()   ← factory method (abstract)
        ▲              ▲
EmailNotification  SMSNotification
createNotifier()   createNotifier()
→ EmailSender      → SMSSender`,
    code: `// Product interface
interface Notifier {
    void notify(String message);
}

// Concrete products
class EmailNotifier implements Notifier {
    public void notify(String msg) {
        System.out.println("Email: " + msg);
    }
}

class SMSNotifier implements Notifier {
    public void notify(String msg) {
        System.out.println("SMS: " + msg);
    }
}

// Creator — factory method pattern
abstract class NotificationService {
    // Factory method — subclass decides what to create
    abstract Notifier createNotifier();

    public void send(String message) {
        Notifier notifier = createNotifier();  // delegated
        notifier.notify(message);
    }
}

class EmailService extends NotificationService {
    @Override
    Notifier createNotifier() { return new EmailNotifier(); }
}

class SMSService extends NotificationService {
    @Override
    Notifier createNotifier() { return new SMSNotifier(); }
}

// Usage
NotificationService service = new EmailService();
service.send("Your order has shipped!");`,
  },
  {
    id: "dp-observer",
    group: "Design Patterns · Behavioural",
    title: "Observer",
    icon: "◎",
    tldr: "When one object changes state, all its dependents are notified automatically.",
    notes: `**Observer** (also called Publish-Subscribe) defines a one-to-many dependency between objects.

Components:
• **Subject (Publisher)** — maintains a list of observers, notifies them on state change.
• **Observer (Subscriber)** — interface with an \`update()\` method.
• **Concrete Observers** — react to the notification.

Real-world uses: Event listeners in UI frameworks, stock price alerts, notification systems, MVC (Model notifies Views).

Java's built-in: \`java.util.Observable\` (deprecated in Java 9) — better to implement your own.`,
    diagram: `StockMarket (Subject)
+ subscribe(observer)
+ unsubscribe(observer)
+ notifyAll()
        │ notifies
   ┌────┼────┐
   ▼    ▼    ▼
PhoneApp  WebApp  EmailAlert
update() update() update()`,
    code: `import java.util.ArrayList;
import java.util.List;

// Observer interface
interface Observer {
    void update(String stockName, double price);
}

// Subject
class StockMarket {
    private List<Observer> observers = new ArrayList<>();
    private String stockName;
    private double price;

    public void subscribe(Observer o)   { observers.add(o); }
    public void unsubscribe(Observer o) { observers.remove(o); }

    public void setPrice(String stock, double price) {
        this.stockName = stock;
        this.price = price;
        notifyObservers();
    }

    private void notifyObservers() {
        for (Observer o : observers) {
            o.update(stockName, price);
        }
    }
}

// Concrete Observers
class PhoneApp implements Observer {
    public void update(String stock, double price) {
        System.out.println("📱 Phone Alert: " + stock + " = ₹" + price);
    }
}

class EmailAlert implements Observer {
    public void update(String stock, double price) {
        System.out.println("📧 Email Alert: " + stock + " = ₹" + price);
    }
}

// Usage
StockMarket market = new StockMarket();
market.subscribe(new PhoneApp());
market.subscribe(new EmailAlert());
market.setPrice("INFY", 1450.50);  // both observers notified`,
  },
  {
    id: "dp-strategy",
    group: "Design Patterns · Behavioural",
    title: "Strategy",
    icon: "⟁",
    tldr: "Define a family of algorithms, encapsulate each one, and make them interchangeable.",
    notes: `**Strategy** lets you swap algorithms at runtime without changing the class that uses them.

Components:
• **Context** — holds a reference to a strategy, delegates the algorithm to it.
• **Strategy interface** — common interface for all algorithms.
• **Concrete Strategies** — actual implementations of the algorithm.

When to use:
• Multiple variations of an algorithm exist.
• You want to avoid if/else or switch blocks for choosing behaviour.
• You need to switch behaviour at runtime.

Relation to other patterns: Strategy is similar to State, but Strategy focuses on *how* something is done, State focuses on *what* an object does based on its current state.`,
    diagram: `SortingContext
- strategy: SortStrategy
+ setStrategy(s)
+ sort(data)
      │ delegates to
      ▼
<<interface>> SortStrategy
+ sort(int[])
      ▲        ▲         ▲
BubbleSort  QuickSort  MergeSort`,
    code: `// Strategy interface
interface SortStrategy {
    void sort(int[] data);
}

// Concrete strategies
class BubbleSort implements SortStrategy {
    public void sort(int[] data) {
        System.out.println("Sorting with Bubble Sort");
        // bubble sort implementation
    }
}

class QuickSort implements SortStrategy {
    public void sort(int[] data) {
        System.out.println("Sorting with Quick Sort");
        // quicksort implementation
    }
}

// Context
class Sorter {
    private SortStrategy strategy;

    public Sorter(SortStrategy strategy) {
        this.strategy = strategy;
    }

    // Swap strategy at runtime
    public void setStrategy(SortStrategy strategy) {
        this.strategy = strategy;
    }

    public void sort(int[] data) {
        strategy.sort(data);   // delegated
    }
}

// Usage
int[] data = {5, 2, 8, 1, 9};
Sorter sorter = new Sorter(new BubbleSort());
sorter.sort(data);                      // Bubble Sort

sorter.setStrategy(new QuickSort());    // swap at runtime
sorter.sort(data);                      // Quick Sort`,
  },
  {
    id: "dp-decorator",
    group: "Design Patterns · Structural",
    title: "Decorator",
    icon: "⊕",
    tldr: "Attach additional responsibilities to an object dynamically, without subclassing.",
    notes: `**Decorator** wraps an object to add new behaviour at runtime. It is an alternative to subclassing for extending functionality.

Components:
• **Component interface** — defines the common interface.
• **Concrete Component** — the base object.
• **Decorator** — wraps a component, implements the same interface, adds extra behaviour.

Real-world examples:
• Java I/O: \`BufferedReader\` wraps \`FileReader\` — adds buffering.
• Adding features to a coffee order: Espresso + Milk + Sugar.

Advantage over inheritance:
• You can mix and match decorators at runtime.
• No explosion of subclasses for every combination.`,
    diagram: `<<interface>> Coffee
+ cost(): int
+ description(): String
        ▲
  SimpleCoffee     ← base (cost: 10)
        ▲
  MilkDecorator    ← wraps Coffee, adds +5
        ▲
  SugarDecorator   ← wraps Coffee, adds +2

new SugarDecorator(new MilkDecorator(new SimpleCoffee()))
→ cost = 10 + 5 + 2 = 17`,
    code: `// Component interface
interface Coffee {
    int cost();
    String description();
}

// Concrete component
class SimpleCoffee implements Coffee {
    public int cost()           { return 10; }
    public String description() { return "Simple Coffee"; }
}

// Abstract decorator
abstract class CoffeeDecorator implements Coffee {
    protected Coffee coffee;
    CoffeeDecorator(Coffee c) { this.coffee = c; }
}

// Concrete decorators
class MilkDecorator extends CoffeeDecorator {
    MilkDecorator(Coffee c) { super(c); }
    public int cost()           { return coffee.cost() + 5; }
    public String description() { return coffee.description() + " + Milk"; }
}

class SugarDecorator extends CoffeeDecorator {
    SugarDecorator(Coffee c) { super(c); }
    public int cost()           { return coffee.cost() + 2; }
    public String description() { return coffee.description() + " + Sugar"; }
}

// Usage — compose at runtime
Coffee myCoffee = new SugarDecorator(
                    new MilkDecorator(
                      new SimpleCoffee()));

System.out.println(myCoffee.description());  // Simple Coffee + Milk + Sugar
System.out.println("₹" + myCoffee.cost());  // ₹17`,
  },
];

// ─── GROUPS ──────────────────────────────────────────────────────────────────

const groupOrder = [
  "OOP Concepts",
  "SOLID Principles",
  "Design Patterns · Creational",
  "Design Patterns · Behavioural",
  "Design Patterns · Structural",
];

// ─── STYLES ──────────────────────────────────────────────────────────────────

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #0d0f12;
    --surface:   #13161b;
    --surface2:  #1a1e26;
    --border:    #252932;
    --accent:    #e8c547;
    --accent2:   #4fc3f7;
    --text:      #e2e5ec;
    --muted:     #6b7280;
    --code-bg:   #0a0c0f;
    --sidebar-w: 270px;
    --radius:    10px;
    --font-head: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-body);
    font-size: 15px;
    line-height: 1.7;
    height: 100vh;
    overflow: hidden;
    display: flex;
  }

  /* ── SIDEBAR ── */
  .sidebar {
    width: var(--sidebar-w);
    min-width: var(--sidebar-w);
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
  }

  .sidebar-header {
    padding: 22px 20px 16px;
    border-bottom: 1px solid var(--border);
  }

  .sidebar-logo {
    font-family: var(--font-head);
    font-weight: 800;
    font-size: 18px;
    letter-spacing: -0.3px;
    color: var(--accent);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .sidebar-subtitle {
    font-size: 11px;
    color: var(--muted);
    margin-top: 3px;
    font-family: var(--font-mono);
    letter-spacing: 0.5px;
  }

  .search-box {
    margin: 14px 14px 6px;
    position: relative;
  }

  .search-box input {
    width: 100%;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 8px 12px 8px 34px;
    font-size: 13px;
    color: var(--text);
    font-family: var(--font-body);
    outline: none;
    transition: border-color 0.2s;
  }

  .search-box input:focus { border-color: var(--accent); }
  .search-box input::placeholder { color: var(--muted); }

  .search-icon {
    position: absolute;
    left: 11px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--muted);
    font-size: 13px;
    pointer-events: none;
  }

  .nav-scroll {
    flex: 1;
    overflow-y: auto;
    padding: 8px 0 20px;
    scrollbar-width: thin;
    scrollbar-color: var(--border) transparent;
  }

  .nav-group-label {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: var(--muted);
    padding: 14px 18px 6px;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 18px;
    font-size: 13.5px;
    cursor: pointer;
    border-left: 3px solid transparent;
    transition: all 0.15s;
    color: var(--text);
    opacity: 0.75;
  }

  .nav-item:hover { background: var(--surface2); opacity: 1; }

  .nav-item.active {
    border-left-color: var(--accent);
    background: var(--surface2);
    color: var(--accent);
    opacity: 1;
  }

  .nav-icon { font-size: 11px; opacity: 0.6; width: 14px; text-align: center; }

  .nav-progress {
    padding: 14px 18px;
    border-top: 1px solid var(--border);
  }

  .progress-label {
    font-size: 11px;
    color: var(--muted);
    margin-bottom: 6px;
    font-family: var(--font-mono);
    display: flex;
    justify-content: space-between;
  }

  .progress-bar {
    background: var(--surface2);
    border-radius: 99px;
    height: 5px;
    overflow: hidden;
  }

  .progress-fill {
    background: linear-gradient(90deg, var(--accent), var(--accent2));
    height: 100%;
    border-radius: 99px;
    transition: width 0.4s ease;
  }

  /* ── MAIN ── */
  .main {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
  }

  .topbar {
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    padding: 14px 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
  }

  .topbar-title {
    font-family: var(--font-head);
    font-size: 20px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .topbar-group {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--muted);
    letter-spacing: 0.8px;
    text-transform: uppercase;
    margin-top: 2px;
  }

  .reviewed-btn {
    background: transparent;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    color: var(--muted);
    padding: 7px 14px;
    font-size: 12px;
    cursor: pointer;
    font-family: var(--font-body);
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .reviewed-btn:hover { border-color: var(--accent); color: var(--accent); }
  .reviewed-btn.done { background: var(--accent); border-color: var(--accent); color: #000; font-weight: 600; }

  /* ── CONTENT ── */
  .content-scroll {
    flex: 1;
    overflow-y: auto;
    padding: 30px;
    scrollbar-width: thin;
    scrollbar-color: var(--border) transparent;
  }

  .tldr-card {
    background: linear-gradient(135deg, rgba(232,197,71,0.08), rgba(79,195,247,0.05));
    border: 1px solid rgba(232,197,71,0.25);
    border-radius: var(--radius);
    padding: 16px 20px;
    margin-bottom: 24px;
    display: flex;
    gap: 12px;
    align-items: flex-start;
  }

  .tldr-label {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 1px;
    color: var(--accent);
    text-transform: uppercase;
    background: rgba(232,197,71,0.12);
    padding: 2px 7px;
    border-radius: 4px;
    white-space: nowrap;
    margin-top: 2px;
  }

  .tldr-text { font-size: 14.5px; color: var(--text); }

  .section {
    margin-bottom: 28px;
  }

  .section-title {
    font-family: var(--font-head);
    font-size: 13px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--accent2);
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .section-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  .notes-box {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 20px 22px;
    font-size: 14.5px;
    line-height: 1.8;
    white-space: pre-wrap;
  }

  .notes-box strong { color: var(--accent); font-weight: 600; }
  .notes-box code {
    font-family: var(--font-mono);
    font-size: 12.5px;
    background: var(--code-bg);
    padding: 1px 6px;
    border-radius: 4px;
    color: var(--accent2);
  }

  .diagram-box {
    background: var(--code-bg);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 20px 22px;
    font-family: var(--font-mono);
    font-size: 12.5px;
    line-height: 1.9;
    white-space: pre;
    overflow-x: auto;
    color: #a8c4d0;
  }

  .code-box {
    background: var(--code-bg);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
  }

  .code-header {
    background: var(--surface2);
    padding: 8px 16px;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--muted);
    border-bottom: 1px solid var(--border);
    display: flex;
    gap: 6px;
    align-items: center;
  }

  .dot { width: 10px; height: 10px; border-radius: 50%; }
  .dot-r { background: #ff5f57; }
  .dot-y { background: #febc2e; }
  .dot-g { background: #28c840; }

  .code-body {
    padding: 18px 20px;
    font-family: var(--font-mono);
    font-size: 12.5px;
    line-height: 1.8;
    white-space: pre;
    overflow-x: auto;
    color: #c9d1d9;
  }

  /* syntax highlight */
  .kw   { color: #ff7b72; }
  .str  { color: #a5d6ff; }
  .cmt  { color: #6a737d; font-style: italic; }
  .cls  { color: #ffa657; }
  .fn   { color: #d2a8ff; }
  .num  { color: #79c0ff; }

  /* ── WELCOME ── */
  .welcome {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
    gap: 14px;
    padding: 40px;
  }

  .welcome-title {
    font-family: var(--font-head);
    font-size: 36px;
    font-weight: 800;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .welcome-sub { color: var(--muted); max-width: 420px; font-size: 15px; }

  .welcome-stats {
    display: flex;
    gap: 24px;
    margin-top: 10px;
  }

  .stat-box {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 16px 24px;
    text-align: center;
  }

  .stat-num {
    font-family: var(--font-head);
    font-size: 28px;
    font-weight: 800;
    color: var(--accent);
  }

  .stat-label { font-size: 12px; color: var(--muted); }

  /* ── NO RESULTS ── */
  .no-results {
    padding: 14px 18px;
    font-size: 13px;
    color: var(--muted);
    font-style: italic;
  }
`;

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function renderNotes(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

function highlightCode(code) {
  return code
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/(\/\/.*)/g, '<span class="cmt">$1</span>')
    .replace(/\b(public|private|protected|class|interface|abstract|extends|implements|new|return|void|static|final|this|super|import|package|for|while|if|else|throws|throw|try|catch|enum|default|instanceof)\b/g, '<span class="kw">$1</span>')
    .replace(/"([^"]*?)"/g, '<span class="str">"$1"</span>')
    .replace(/\b(\d+(\.\d+)?)\b/g, '<span class="num">$1</span>');
}

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [reviewed, setReviewed] = useState({});

  const filtered = useMemo(() => {
    if (!search.trim()) return topics;
    const q = search.toLowerCase();
    return topics.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.group.toLowerCase().includes(q) ||
        t.tldr.toLowerCase().includes(q)
    );
  }, [search]);

  const reviewedCount = Object.values(reviewed).filter(Boolean).length;
  const pct = Math.round((reviewedCount / topics.length) * 100);

  const topic = selected ? topics.find((t) => t.id === selected) : null;

  const grouped = groupOrder.reduce((acc, g) => {
    const items = filtered.filter((t) => t.group === g);
    if (items.length) acc[g] = items;
    return acc;
  }, {});

  return (
    <>
      <style>{styles}</style>
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span>⬡</span> LLD Guide
          </div>
          <div className="sidebar-subtitle">Low-Level Design · Java</div>
        </div>

        <div className="search-box">
          <span className="search-icon">⌕</span>
          <input
            placeholder="Search topics…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="nav-scroll">
          {Object.keys(grouped).length === 0 && (
            <div className="no-results">No topics match "{search}"</div>
          )}
          {Object.entries(grouped).map(([group, items]) => (
            <div key={group}>
              <div className="nav-group-label">{group}</div>
              {items.map((t) => (
                <div
                  key={t.id}
                  className={`nav-item ${selected === t.id ? "active" : ""}`}
                  onClick={() => setSelected(t.id)}
                >
                  <span className="nav-icon">{reviewed[t.id] ? "✓" : t.icon}</span>
                  {t.title}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="nav-progress">
          <div className="progress-label">
            <span>PROGRESS</span>
            <span>{reviewedCount}/{topics.length}</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      <div className="main">
        {!topic ? (
          <div className="content-scroll">
            <div className="welcome">
              <div className="welcome-title">Low-Level Design</div>
              <div className="welcome-sub">
                Your personal reference for OOP, SOLID Principles, and Design Patterns — with Java examples and diagrams.
              </div>
              <div className="welcome-stats">
                <div className="stat-box">
                  <div className="stat-num">5</div>
                  <div className="stat-label">OOP Concepts</div>
                </div>
                <div className="stat-box">
                  <div className="stat-num">5</div>
                  <div className="stat-label">SOLID Principles</div>
                </div>
                <div className="stat-box">
                  <div className="stat-num">5</div>
                  <div className="stat-label">Design Patterns</div>
                </div>
                <div className="stat-box">
                  <div className="stat-num">{pct}%</div>
                  <div className="stat-label">Reviewed</div>
                </div>
              </div>
              <div style={{ color: "var(--muted)", fontSize: "13px", marginTop: "6px" }}>
                ← Select a topic from the sidebar to begin
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="topbar">
              <div>
                <div className="topbar-title">
                  <span>{topic.icon}</span> {topic.title}
                </div>
                <div className="topbar-group">{topic.group}</div>
              </div>
              <button
                className={`reviewed-btn ${reviewed[topic.id] ? "done" : ""}`}
                onClick={() =>
                  setReviewed((r) => ({ ...r, [topic.id]: !r[topic.id] }))
                }
              >
                {reviewed[topic.id] ? "✓ Reviewed" : "○ Mark as Reviewed"}
              </button>
            </div>

            <div className="content-scroll">
              {/* TL;DR */}
              <div className="tldr-card">
                <span className="tldr-label">TL;DR</span>
                <span className="tldr-text">{topic.tldr}</span>
              </div>

              {/* Notes */}
              <div className="section">
                <div className="section-title">Notes</div>
                <div
                  className="notes-box"
                  dangerouslySetInnerHTML={{ __html: renderNotes(topic.notes) }}
                />
              </div>

              {/* Diagram */}
              <div className="section">
                <div className="section-title">Diagram</div>
                <div className="diagram-box">{topic.diagram}</div>
              </div>

              {/* Code */}
              <div className="section">
                <div className="section-title">Java Example</div>
                <div className="code-box">
                  <div className="code-header">
                    <span className="dot dot-r" />
                    <span className="dot dot-y" />
                    <span className="dot dot-g" />
                    <span style={{ marginLeft: "6px" }}>
                      {topic.title.replace(/[^a-zA-Z]/g, "")}.java
                    </span>
                  </div>
                  <div
                    className="code-body"
                    dangerouslySetInnerHTML={{ __html: highlightCode(topic.code) }}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
