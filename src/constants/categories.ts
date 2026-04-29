import { CategoryType } from "../types/category";

export interface DefaultCategory {
  name: string;
  icon: string;
  color: string;
  type: CategoryType;
  is_default: number;
}

export const DEFAULT_CATEGORIES: DefaultCategory[] = [
  // Expense Categories
  {
    name: "Food & Drink",
    icon: "fast-food-outline",
    color: "#FF6B6B",
    type: "expense",
    is_default: 1,
  },
  {
    name: "Transport",
    icon: "car-outline",
    color: "#4ECDC4",
    type: "expense",
    is_default: 1,
  },
  {
    name: "Shopping",
    icon: "cart-outline",
    color: "#FFE66D",
    type: "expense",
    is_default: 1,
  },
  {
    name: "Housing",
    icon: "home-outline",
    color: "#95E1D3",
    type: "expense",
    is_default: 1,
  },
  {
    name: "Utilities",
    icon: "bulb-outline",
    color: "#F38181",
    type: "expense",
    is_default: 1,
  },
  {
    name: "Entertainment",
    icon: "game-controller-outline",
    color: "#AA96DA",
    type: "expense",
    is_default: 1,
  },
  {
    name: "Health",
    icon: "medical-outline",
    color: "#FF6F91",
    type: "expense",
    is_default: 1,
  },
  {
    name: "Education",
    icon: "book-outline",
    color: "#67C6E3",
    type: "expense",
    is_default: 1,
  },
  {
    name: "Other",
    icon: "ellipsis-horizontal-circle-outline",
    color: "#859490",
    type: "expense",
    is_default: 1,
  },
  // Income Categories
  {
    name: "Salary",
    icon: "wallet-outline",
    color: "#4edea3",
    type: "income",
    is_default: 1,
  },
  {
    name: "Investment",
    icon: "trending-up-outline",
    color: "#4fdbc8",
    type: "income",
    is_default: 1,
  },
  {
    name: "Gift",
    icon: "gift-outline",
    color: "#ffb95f",
    type: "income",
    is_default: 1,
  },
  {
    name: "Freelance",
    icon: "briefcase-outline",
    color: "#71f8e4",
    type: "income",
    is_default: 1,
  },
  {
    name: "Other Income",
    icon: "ellipsis-horizontal-circle-outline",
    color: "#bbcac6",
    type: "income",
    is_default: 1,
  },
];
