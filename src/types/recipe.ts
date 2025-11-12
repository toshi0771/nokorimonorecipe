export interface Recipe {
  id: string;
  name: string;
  ingredients: Ingredient[];
  instructions: string[];
  servings: number;
  cookingTime: string;
  category: string;
}

export interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}

export interface UserIngredient {
  name: string;
  amount: string;
}

export interface RecipeRequest {
  ingredients: UserIngredient[];
  servings: number;
}