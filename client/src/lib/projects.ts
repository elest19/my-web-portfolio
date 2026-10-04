export type ProjectSkill = {
  name: string;
  note: string;
};

export type ProjectImage = {
  src: string;
  label: string;
  description: string;
  visualVariant: "main" | "interface" | "data";
  skills: ProjectSkill[];
  /**
   * Intrinsic pixel size of a real screenshot. Present only on bitmap assets —
   * the CSS-drawn mockups are sized by their own artwork. The Projects grid
   * reads these to give each card the exact shape of its thumbnail.
   */
  width?: number;
  height?: number;
};

type ProjectRecord = {
  id: string;
  number: string;
  name: string;
  type: string;
  year: string;
  color: string;
  visual: string;
  githubUrl: string;
  liveDemoUrl: string;
  images: ProjectImage[];
};

export type PortfolioProject = ProjectRecord & {
  thumbnail: string;
  /** Intrinsic size of `thumbnail`, forwarded to the card so it can match the image. */
  thumbnailWidth?: number;
  thumbnailHeight?: number;
};

const projectRecords: ProjectRecord[] = [
  {
    id: "lakayago",
    number: "01",
    name: "LAKAYAGO / AROO MANAGEMENT HUB",
    type: "ATTENDANCE, PAYROLL, SALES & INVENTORY SYSTEM",
    year: "2026",
    color: "blue",
    visual: "kinetic-visual",
    githubUrl: "https://github.com/elest19/LakayAgo",
    liveDemoUrl: "https://example.com",
    images: [
      {
        src: "/lakayago-images/thumbnail.png",
        label: "Payroll dashboard",
        visualVariant: "main",
        width: 1919,
        height: 946,
        description:
          "A platform for managing employee attendance, payroll, and sales & inventory for Lakay Ago and Aroo restaurant.",
        skills: [
          {
            name: "React",
            note: "Composes the dashboard, employee, and payroll views.",
          },
          {
            name: "Node.js",
            note: "Serves attendance, payroll, and employee services.",
          },
          {
            name: "PostgreSQL",
            note: "Persists employee records, attendance, and payroll history.",
          },
        ],
      },
      {
        src: "mockup:lakayago:interface",
        label: "Attendance & payroll flow",
        visualVariant: "interface",
        description:
          "A closer look at the guided payroll workflow, from importing and validating attendance through calculation, review, approval, and payslip generation.",
        skills: [
          { name: "React", note: "Renders the step-by-step payroll workflow." },
          {
            name: "State Management",
            note: "Keeps each payroll step and its review status in sync.",
          },
          {
            name: "UX",
            note: "Makes a sensitive, multi-step process easy to follow.",
          },
        ],
      },
      {
        src: "mockup:lakayago:data",
        label: "Workforce data model",
        visualVariant: "data",
        description:
          "A placeholder map of the relationships between employees, attendance records, leave requests, and payroll periods.",
        skills: [
          {
            name: "PostgreSQL",
            note: "Stores employee, attendance, and payroll records.",
          },
          {
            name: "Data Modeling",
            note: "Relates employees to attendance and payroll periods.",
          },
          {
            name: "REST APIs",
            note: "Connects the dashboard to HR and payroll services.",
          },
        ],
      },
    ],
  },
  {
    id: "rclpg",
    number: "02",
    name: "RCLPG MANAGEMENT SYSTEM",
    type: "SALES & INVENTORY SYSTEM",
    year: "2026",
    color: "violet",
    visual: "nova-visual",
    githubUrl: "https://github.com/johnpaulruiz003-art/rclpg-demo",
    liveDemoUrl: "https://rclpg-demo.vercel.app/",
    images: [
      {
        src: "/rclpg-images/thumbnail.png",
        label: "Sales report dashboard",
        visualVariant: "main",
        width: 1911,
        height: 942,
        description:
          "A Sales & Inventory System for RCLPG, an LPG trading business, providing a more efficient sales reporting, inventory, customer credit logs, and employee profiles.",
        skills: [
          {
            name: "React.js",
            note: "Builds the desktop-first dashboard, catalog, and credit log views, with mobile responsiveness.",
          },
          {
            name: "Node.js & Express.js",
            note: "Serves the sales, inventory, and customer record services.",
          },
          {
            name: "PostgreSQL",
            note: "Persists sales, credit, tank exchanges, and stock movements.",
          },
          {
            name: "REST APIs",
            note: "Connects the React interface to inventory, sales, credit, and reporting endpoints.",
          },
          {
            name: "Database Design",
            note: "Models products, customers, credit balances, and LPG tank movement.",
          },
          {
            name: "CRUD Operations",
            note: "Handles day-to-day records for stock, sales, customers, and expenses.",
          },
          {
            name: "Testing & Debugging",
            note: "Tests workflows and fixes issues across the frontend, API, and database.",
          },
          {
            name: "Vercel",
            note: "Hosts and deploys the React frontend of the live system.",
          },
          {
            name: "Render",
            note: "Hosts the Node.js and Express.js backend services.",
          },
          {
            name: "Full-Stack Development",
            note: "Owns the system end to end as its full stack developer, from the database to the deployed interface.",
          },
          {
            name: "GitHub",
            note: "Manages version control and deployment of the project.",
          },
          {
            name: "AI-Assisted Programming",
            note: "Speeds up development and iteration using AI pair programming.",
          },
        ],
      },
      {
        src: "/rclpg-images/inventory_catalog.png",
        label: "Inventory Catalog",
        visualVariant: "interface",
        description:
          "This is the inventory catalog, this page shows the different tanks that the system has. It also shows the different information about the tanks such as the name, price, and quantity of the tanks.",
        skills: [
          {
            name: "React",
            note: "Renders reusable catalog and credit tables.",
          },
          {
            name: "Responsive Design",
            note: "Adapts management views to desktop and tablet.",
          },
          { name: "UX", note: "Keeps dense business records easy to scan." },
        ],
      },
      {
        src: "/rclpg-images/sales_log.png",
        label: "Customer & Sales Logs",
        visualVariant: "data",
        description:
          "This is the customer and sales logs, this page shows the sales made for a particular date. It also shows the different information about the sales such as the customer name, product name, and quantity of the products sold.",
        skills: [
          {
            name: "PostgreSQL",
            note: "Stores sales, stock, and credit records.",
          },
          {
            name: "REST APIs",
            note: "Connects the portal to reporting services.",
          },
          {
            name: "Data Modeling",
            note: "Defines relationships between customers, sales, and inventory.",
          },
        ],
      },
      {
        src: "/rclpg-images/credits.png",
        label: "Credit Logs",
        visualVariant: "data",
        description:
          "This is the credit logs, this page shows the credit records for a particular customer. It also shows the different information about the credits such as the customer name, product name, and quantity of the products sold.",
        skills: [
          {
            name: "PostgreSQL",
            note: "Stores sales, stock, and credit records.",
          },
          {
            name: "REST APIs",
            note: "Connects the portal to reporting services.",
          },
          {
            name: "Data Modeling",
            note: "Defines relationships between customers, sales, and inventory.",
          },
        ],
      },
      {
        src: "/rclpg-images/admin.png",
        label: "Admin Dashboard",
        visualVariant: "interface",
        description:
          "This is the admin dashboard, this page shows the administrative controls for managing the system.",
        skills: [
          {
            name: "PostgreSQL",
            note: "Stores sales, stock, and credit records.",
          },
          {
            name: "REST APIs",
            note: "Connects the portal to reporting services.",
          },
          {
            name: "Data Modeling",
            note: "Defines relationships between customers, sales, and inventory.",
          },
        ],
      },
      {
        src: "/rclpg-images/login.png",
        label: "Login Page",
        visualVariant: "data",
        description:
          "This is the login page, this page shows the interface for users to log in to the system.",
        skills: [
          {
            name: "PostgreSQL",
            note: "Stores sales, stock, and credit records.",
          },
          {
            name: "REST APIs",
            note: "Connects the portal to reporting services.",
          },
          {
            name: "Data Modeling",
            note: "Defines relationships between customers, sales, and inventory.",
          },
        ],
      },
    ],
  },
  {
    id: "popcom",
    number: "03",
    name: "SAN FABIAN POPCOM WEB PORTAL",
    type: "WEB PORTAL",
    year: "2025",
    color: "lime",
    visual: "forme-visual",
    githubUrl: "https://github.com/johnpaulruiz003-art/popcom-demo",
    liveDemoUrl: "https://popcom-demo-w7m5.vercel.app/",
    images: [
      {
        src: "/popcom-images/thumbnail.png",
        label: "Municipal office homepage",
        visualVariant: "main",
        width: 1919,
        height: 943,
        description:
          "A public information site for population office of San Fabian. (Note: This is just a thesis project and not an official government site)",
        skills: [
          {
            name: "React.js",
            note: "Builds responsive components that streamline data encoding for municipal staff.",
          },
          {
            name: "Node.js & Express.js",
            note: "Serves secure API endpoints for citizen record handling.",
          },
          {
            name: "PostgreSQL",
            note: "Stores citizen records in optimized schemas for efficient administrative workflows.",
          },
          {
            name: "REST APIs",
            note: "Connects the React interface to record management and notification endpoints.",
          },
          {
            name: "Database Normalization",
            note: "Structures the schema to reduce redundancy and keep records consistent.",
          },
          {
            name: "Mailjet",
            note: "Sends email notifications from the portal.",
          },
          {
            name: "TextBee",
            note: "Sends SMS notifications from the portal.",
          },
          {
            name: "Rapid Application Development",
            note: "Prototypes features quickly and iterates on feedback from municipal staff.",
          },
          {
            name: "Full-Stack Development",
            note: "Delivers the portal end to end, from the database to the deployed interface.",
          },
          {
            name: "AI-Assisted Programming",
            note: "Speeds up development and iteration using AI pair programming.",
          },
          {
            name: "Requirements Gathering",
            note: "Works with municipal staff to identify needs and refine features based on their feedback.",
          },
        ],
      },
      {
        src: "/popcom-images/services.png",
        label: "Services & announcements",
        visualVariant: "interface",
        description:
          "A closer look at the services directory, schedule of activities, education corner, and the news feed that carry the office's public information.",
        skills: [
          { name: "React", note: "Renders service listings and news cards." },
          {
            name: "Search & Filtering",
            note: "Helps visitors find records and announcements quickly.",
          },
          {
            name: "Information Architecture",
            note: "Organizes services around common resident needs.",
          },
        ],
      },
      {
        src: "/popcom-images/schedules.png",
        label: "Schedule of Activities",
        visualVariant: "data",
        description:
          "This page shows the available activities such as Pre-Marriage Orientation, Usapan-Series, and Event/Activities.",
        skills: [
          {
            name: "REST APIs",
            note: "Delivers service and announcement content to the site.",
          },
          {
            name: "Data Modeling",
            note: "Relates offices, services, and announcements.",
          },
          {
            name: "PostgreSQL",
            note: "Stores public information and downloadable records.",
          },
        ],
      },
      {
        src: "/popcom-images/education.png",
        label: "Education Corner",
        visualVariant: "data",
        description:
          "This page provides educational resources and information for residents.",
        skills: [
          {
            name: "REST APIs",
            note: "Delivers service and announcement content to the site.",
          },
          {
            name: "Data Modeling",
            note: "Relates offices, services, and announcements.",
          },
          {
            name: "PostgreSQL",
            note: "Stores public information and downloadable records.",
          },
        ],
      },
      {
        src: "/popcom-images/faq.png",
        label: "Frequently Asked Questions",
        visualVariant: "data",
        description:
          "This page provides answers to common questions from residents.",
        skills: [
          {
            name: "REST APIs",
            note: "Delivers service and announcement content to the site.",
          },
          {
            name: "Data Modeling",
            note: "Relates offices, services, and announcements.",
          },
          {
            name: "PostgreSQL",
            note: "Stores public information and downloadable records.",
          },
        ],
      },
      {
        src: "/popcom-images/about.png",
        label: "About Us",
        visualVariant: "data",
        description:
          "This page provides information about the organization and its mission.",
        skills: [
          {
            name: "REST APIs",
            note: "Delivers service and announcement content to the site.",
          },
          {
            name: "Data Modeling",
            note: "Relates offices, services, and announcements.",
          },
          {
            name: "PostgreSQL",
            note: "Stores public information and downloadable records.",
          },
        ],
      },
      {
        src: "/popcom-images/dashboard.png",
        label: "Dashboard",
        visualVariant: "data",
        description:
          "This page provides a centralized view of the organization's key metrics and activities.",
        skills: [
          {
            name: "REST APIs",
            note: "Delivers service and announcement content to the site.",
          },
          {
            name: "Data Modeling",
            note: "Relates offices, services, and announcements.",
          },
          {
            name: "PostgreSQL",
            note: "Stores public information and downloadable records.",
          },
        ],
      },
    ],
  },
  {
    id: "bigmlpg",
    number: "04",
    name: "BIGMLPG MANAGEMENT SYSTEM",
    type: "SALES & INVENTORY SYSTEM",
    year: "2026",
    color: "violet",
    visual: "nova-visual",
    githubUrl: "https://github.com/johnpaulruiz003-art/bigmlpg-demo",
    liveDemoUrl: "https://bigmlpg-demo.vercel.app/",
    images: [
      {
        src: "/bigmlpg-images/thumbnail.png",
        label: "Project cover",
        visualVariant: "main",
        width: 1918,
        height: 948,
        description:
          "A Sales & Inventory System for BigMLPG, an LPG trading business, providing a more efficient sales reporting, inventory, and customer credit logs.",
        skills: [
          {
            name: "React.js",
            note: "Builds mobile-first dashboard, catalog, and credit log views, with a responsive layout for desktop.",
          },
          {
            name: "Node.js & Express.js",
            note: "Serves the sales, inventory, and customer record services.",
          },
          {
            name: "PostgreSQL",
            note: "Persists sales, credit, tank exchanges, and stock movements.",
          },
          {
            name: "REST APIs",
            note: "Connects the React interface to inventory, sales, credit, and reporting endpoints.",
          },
          {
            name: "Database Design",
            note: "Models products, customers, credit balances, and LPG tank movement.",
          },
          {
            name: "CRUD Operations",
            note: "Handles day-to-day records for stock, sales, customers, and expenses.",
          },
          {
            name: "Requirements Gathering",
            note: "Works directly with the client to identify bottlenecks and turn daily operations into system workflows.",
          },
          {
            name: "Testing & Debugging",
            note: "Tests workflows and fixes issues across the frontend, API, and database.",
          },
          {
            name: "Vercel",
            note: "Hosts and deploys the React frontend of the live system.",
          },
          {
            name: "Render",
            note: "Hosts the Node.js and Express.js backend services.",
          },
          {
            name: "Full-Stack Development",
            note: "Owns the system end to end as its full stack developer, from the database to the deployed interface.",
          },
          {
            name: "GitHub",
            note: "Manages version control and deployment of the project.",
          },
          {
            name: "AI-Assisted Programming",
            note: "Speeds up development and iteration using AI pair programming.",
          },
        ],
      },
      {
        src: "/bigmlpg-images/inventory_catalog.png",
        label: "Inventory Catalog",
        visualVariant: "interface",
        description:
          "This is the inventory catalog, this page shows the different tanks that the system has. It also shows the different information about the tanks such as the name, price, and quantity of the tanks.",
        skills: [
          {
            name: "React",
            note: "Renders reusable catalog and credit tables.",
          },
          {
            name: "Mobile-First Design",
            note: "Lets staff check inventory quickly from a smartphone.",
          },
          { name: "UX", note: "Keeps dense business records easy to scan." },
        ],
      },
      {
        src: "/bigmlpg-images/sales_log.png",
        label: "Customer & Sales Logs",
        visualVariant: "data",
        description:
          "This is the customer and sales logs, this page shows the sales made for a particular date. It also shows the different information about the sales such as the customer name, product name, and quantity of the products sold.",
        skills: [
          {
            name: "PostgreSQL",
            note: "Stores sales, stock, and credit records.",
          },
          {
            name: "REST APIs",
            note: "Connects the portal to reporting services.",
          },
          {
            name: "Data Modeling",
            note: "Defines relationships between customers, sales, and inventory.",
          },
        ],
      },
      {
        src: "/bigmlpg-images/credits.png",
        label: "Credit Logs",
        visualVariant: "data",
        description:
          "This is the credit logs, this page shows the credit records for a particular customer. It also shows the different information about the credits such as the customer name, product name, and quantity of the products sold.",
        skills: [
          {
            name: "PostgreSQL",
            note: "Stores sales, stock, and credit records.",
          },
          {
            name: "REST APIs",
            note: "Connects the portal to reporting services.",
          },
          {
            name: "Data Modeling",
            note: "Defines relationships between customers, sales, and inventory.",
          },
        ],
      },
      {
        src: "/bigmlpg-images/admin.png",
        label: "Admin Dashboard",
        visualVariant: "interface",
        description:
          "This is the admin dashboard, this page shows the administrative controls for managing the system.",
        skills: [
          {
            name: "PostgreSQL",
            note: "Stores sales, stock, and credit records.",
          },
          {
            name: "REST APIs",
            note: "Connects the portal to reporting services.",
          },
          {
            name: "Data Modeling",
            note: "Defines relationships between customers, sales, and inventory.",
          },
        ],
      },
      {
        src: "/bigmlpg-images/login.png",
        label: "Login Page",
        visualVariant: "data",
        description:
          "This is the login page, this page shows the interface for users to log in to the system.",
        skills: [
          {
            name: "PostgreSQL",
            note: "Stores sales, stock, and credit records.",
          },
          {
            name: "REST APIs",
            note: "Connects the portal to reporting services.",
          },
          {
            name: "Data Modeling",
            note: "Defines relationships between customers, sales, and inventory.",
          },
        ],
      },
    ],
  },
];

export const projects: PortfolioProject[] = projectRecords.map((project) => ({
  ...project,
  thumbnail: project.images[0].src,
  thumbnailWidth: project.images[0].width,
  thumbnailHeight: project.images[0].height,
}));

export function projectPath(id: string) {
  return `/projects/${id}`;
}
