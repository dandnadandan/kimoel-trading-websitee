import { Category, Product } from '@/types';

// Import existing images
import electricalImage from "@/assets/ELECTRICAL.jpg";
import mechanicalImage from "@/assets/MECHANICAL COMPONENTS.png";
import pneumaticsImage from "@/assets/PNEUMATICS.png";
import toolsImage from "@/assets/TOOLS.jpeg";

import electricalSupplies from "@/assets/Electrical Supplies.jpg";
import electricalPanel from "@/assets/Electrical Panel.png";
import cableTray from "@/assets/Cable Tray.jpg";
import acMotor from "@/assets/AC Motors and Gear Motors.png";
import bearings from "@/assets/Bearing and Seal.jpg";
import pneumaticsPart from "@/assets/Pneumatic Cylinder Accessories.jpg";
import conveyor from "@/assets/Conveyor System.png";
import jigs from "@/assets/Jigs and Fixtures.png";

export const seedCategories: Category[] = [
  {
    id: "1",
    name: "Electrical",
    slug: "electrical",
    description: "Electrical supplies and equipment including panels, cable trays, and more.",
    image: electricalImage,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Mechanical Components",
    slug: "mechanical-components",
    description: "Industrial-grade motors, bearings, and seals for durability and precision.",
    image: mechanicalImage,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Automation & Pneumatics",
    slug: "automation-pneumatics",
    description: "Pneumatic and automation parts designed for smooth control and efficiency.",
    image: pneumaticsImage,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Systems & Tooling",
    slug: "systems-tooling",
    description: "Custom conveyor systems, jigs, and fixtures for industrial use.",
    image: toolsImage,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const seedProducts: Product[] = [
  // Electrical Products
  {
    id: "1",
    name: "Electrical Supply",
    slug: "electrical-supply",
    categoryId: "1",
    images: [electricalSupplies],
    price: 62500.00,
    stockQty: 15,
    description: "Complete solutions for industrial and commercial use. High-quality electrical supplies that meet industry standards.",
    specs: {
      voltage: "220V-440V",
      frequency: "50/60Hz",
      certification: "CE Certified",
      warranty: "2 Years",
    },
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Electrical Panel",
    slug: "electrical-panel",
    categoryId: "1",
    images: [electricalPanel],
    price: 140000.00,
    stockQty: 8,
    description: "Durable and safe panels for power distribution. Designed for industrial applications with safety features.",
    specs: {
      type: "MCC Panel",
      rating: "400A",
      material: "Mild Steel",
      protection: "IP54",
    },
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Cable Tray",
    slug: "cable-tray",
    categoryId: "1",
    images: [cableTray],
    price: 22500.00,
    stockQty: 25,
    description: "Reliable cable trays for safe wiring management. Supports heavy cable loads with easy installation.",
    specs: {
      material: "Galvanized Steel",
      loadCapacity: "50 kg/m",
      width: "300mm",
      length: "3m",
    },
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  
  // Mechanical Components
  {
    id: "4",
    name: "AC Motors and Gear Motors",
    slug: "ac-motors-gear-motors",
    categoryId: "2",
    images: [acMotor],
    price: 92500.00,
    stockQty: 12,
    description: "Industrial-grade motors built for durability. High efficiency motors for various industrial applications.",
    specs: {
      power: "5 HP",
      speed: "1440 RPM",
      phase: "3 Phase",
      efficiency: "85%",
    },
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Bearings & Seals",
    slug: "bearings-seals",
    categoryId: "2",
    images: [bearings],
    price: 16000.00,
    stockQty: 50,
    description: "Durable bearings and seals for precision. High-quality components for smooth mechanical operations.",
    specs: {
      type: "Ball Bearing",
      size: "60mm x 110mm x 22mm",
      material: "Chrome Steel",
      speed: "6000 RPM",
    },
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  
  // Automation & Pneumatics
  {
    id: "6",
    name: "Pneumatic Cylinder Accessories",
    slug: "pneumatic-cylinder-accessories",
    categoryId: "3",
    images: [pneumaticsPart],
    price: 34000.00,
    stockQty: 20,
    description: "High-quality pneumatic parts for automation systems. Reliable components for industrial automation.",
    specs: {
      cylinderType: "Double Acting",
      boreSize: "80mm",
      stroke: "200mm",
      pressure: "8 Bar",
    },
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  
  // Systems & Tooling
  {
    id: "7",
    name: "Conveyor System",
    slug: "conveyor-system",
    categoryId: "4",
    images: [conveyor],
    price: 275000.00,
    stockQty: 5,
    description: "Custom conveyor systems for industrial use. Modular design for various material handling needs.",
    specs: {
      length: "10m",
      width: "800mm",
      speed: "20 m/min",
      capacity: "100 kg/m",
    },
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "8",
    name: "Jigs and Fixtures",
    slug: "jigs-fixtures",
    categoryId: "4",
    images: [jigs],
    price: 47500.00,
    stockQty: 18,
    description: "Precision jigs and fixtures for manufacturing. Custom solutions for production line optimization.",
    specs: {
      material: "Tool Steel",
      accuracy: "±0.01mm",
      application: "CNC Machining",
      customization: "Available",
    },
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
