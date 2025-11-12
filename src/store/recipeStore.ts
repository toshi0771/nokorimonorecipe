import { create } from 'zustand';
import { Recipe, UserIngredient } from '../types/recipe';
import { recipeVariations } from '../data/sampleRecipes';

interface RecipeStore {
  // 状態
  generatedRecipes: Recipe[];
  selectedRecipe: Recipe | null;
  userIngredients: UserIngredient[];
  servings: number;
  selectedRecipeIds: Set<string>;
  
  // アクション
  setSelectedRecipe: (recipe: Recipe | null) => void;
  addUserIngredient: (ingredient: UserIngredient) => void;
  removeUserIngredient: (index: number) => void;
  setUserIngredients: (ingredients: UserIngredient[]) => void;
  setServings: (servings: number) => void;
  generateRecipesFromIngredients: () => void;
  removeRecipes: (recipeIds: string[]) => void;
  toggleRecipeSelection: (recipeId: string) => void;
  clearSelections: () => void;
  generateNewRecipe: (userIngredients: UserIngredient[]) => Recipe;
}

// 材料に基づいたレシピ生成関数
const generateRecipeFromIngredients = (userIngredients: UserIngredient[], existingRecipes: Recipe[] = []): Recipe => {
  if (userIngredients.length === 0) {
    throw new Error('材料が入力されていません');
  }

  // ユーザーの材料に基づいてカテゴリを推定
  const ingredientNames = userIngredients.map(ing => ing.name.toLowerCase());
  let category = '野菜料理';
  let cookingTime = '15分';
  
  if (ingredientNames.some(name => name.includes('卵'))) {
    category = '卵料理';
    cookingTime = '10分';
  } else if (ingredientNames.some(name => name.includes('ご飯') || name.includes('米'))) {
    category = 'ご飯もの';
    cookingTime = '12分';
  } else if (ingredientNames.some(name => name.includes('豆腐') || name.includes('わかめ'))) {
    category = '汁物';
    cookingTime = '8分';
  }
  
  const variations = recipeVariations[category as keyof typeof recipeVariations];
  
  // 既存のレシピと重複しないように名前を選択
  let recipeName = '';
  let attempts = 0;
  do {
    recipeName = variations[Math.floor(Math.random() * variations.length)];
    attempts++;
  } while (attempts < 10 && existingRecipes.some(recipe => recipe.name === recipeName));
  
  // ユーザー材料をベースとしてレシピ材料を作成
  const baseIngredients = userIngredients.map(ui => ({
    name: ui.name,
    amount: ui.amount || '適量',
    unit: ''
  }));
  
  // カテゴリに応じた基本調味料を追加
  const seasonings = {
    野菜料理: [
      { name: '醤油', amount: '大さじ2', unit: '' }, 
      { name: 'ごま油', amount: '大さじ1', unit: '' },
      { name: '塩', amount: '少々', unit: '' }
    ],
    卵料理: [
      { name: '塩', amount: '少々', unit: '' }, 
      { name: 'こしょう', amount: '少々', unit: '' },
      { name: '油', amount: '適量', unit: '' }
    ],
    ご飯もの: [
      { name: '醤油', amount: '大さじ1', unit: '' }, 
      { name: 'ごま油', amount: '大さじ1', unit: '' },
      { name: '塩', amount: '少々', unit: '' }
    ],
    汁物: [
      { name: 'だしの素', amount: '小さじ1', unit: '' }, 
      { name: '醤油', amount: '大さじ1', unit: '' },
      { name: '水', amount: '400', unit: 'ml' }
    ]
  };
  
  const additionalIngredients = seasonings[category as keyof typeof seasonings] || [];
  
  // 材料に応じた調理手順を生成
  const generateInstructions = (category: string, ingredients: string[]): string[] => {
    const baseSteps = {
      野菜料理: [
        `${ingredients.join('、')}を食べやすい大きさに切る`,
        'フライパンに油を熱する',
        '材料を炒める',
        '調味料で味付けして完成'
      ],
      卵料理: [
        '卵を溶いて調味料を加える',
        'フライパンに油を熱する',
        `${ingredients.filter(ing => ing !== '卵').join('、')}を加えて炒める`,
        '卵液を流し入れて調理する',
        '形を整えて完成'
      ],
      ご飯もの: [
        `${ingredients.filter(ing => !ing.includes('ご飯')).join('、')}を食べやすい大きさに切る`,
        'フライパンに油を熱する',
        '具材を炒める',
        'ご飯を加えて炒める',
        '調味料で味付けして完成'
      ],
      汁物: [
        `${ingredients.join('、')}を食べやすい大きさに切る`,
        '鍋に水とだしの素を入れて沸騰させる',
        '具材を加えて煮る',
        '調味料で味を整えて完成'
      ]
    };
    
    return baseSteps[category as keyof typeof baseSteps] || baseSteps['野菜料理'];
  };
  
  const instructions = generateInstructions(category, ingredientNames);
  
  return {
    id: `generated-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: recipeName,
    ingredients: [...baseIngredients, ...additionalIngredients],
    instructions,
    servings: 2,
    cookingTime,
    category
  };
};

export const useRecipeStore = create<RecipeStore>((set, get) => ({
  // 初期状態
  generatedRecipes: [],
  selectedRecipe: null,
  userIngredients: [],
  servings: 2,
  selectedRecipeIds: new Set(),
  
  // アクション
  setSelectedRecipe: (recipe) => set({ selectedRecipe: recipe }),
  
  addUserIngredient: (ingredient) => set((state) => {
    const newIngredients = [...state.userIngredients, ingredient];
    return { userIngredients: newIngredients };
  }),
  
  removeUserIngredient: (index) => set((state) => {
    const newIngredients = state.userIngredients.filter((_, i) => i !== index);
    return { userIngredients: newIngredients };
  }),
  
  setUserIngredients: (ingredients) => set({ userIngredients: ingredients }),
  
  setServings: (servings) => set({ servings }),
  
  generateRecipesFromIngredients: () => {
    const { userIngredients } = get();
    if (userIngredients.length === 0) return;
    
    // 材料に基づいて3つのレシピを生成
    const newRecipes: Recipe[] = [];
    const maxRecipes = 3;
    
    for (let i = 0; i < maxRecipes; i++) {
      try {
        const recipe = generateRecipeFromIngredients(userIngredients, newRecipes);
        newRecipes.push(recipe);
      } catch (error) {
        console.warn('レシピ生成エラー:', error);
        break;
      }
    }
    
    set({ generatedRecipes: newRecipes, selectedRecipe: null });
  },
  
  removeRecipes: (recipeIds) => set((state) => ({
    generatedRecipes: state.generatedRecipes.filter(recipe => !recipeIds.includes(recipe.id)),
    selectedRecipe: recipeIds.includes(state.selectedRecipe?.id || '') ? null : state.selectedRecipe,
    selectedRecipeIds: new Set()
  })),
  
  toggleRecipeSelection: (recipeId) => set((state) => {
    const newSelection = new Set(state.selectedRecipeIds);
    if (newSelection.has(recipeId)) {
      newSelection.delete(recipeId);
    } else {
      newSelection.add(recipeId);
    }
    return { selectedRecipeIds: newSelection };
  }),
  
  clearSelections: () => set({ selectedRecipeIds: new Set() }),
  
  generateNewRecipe: (userIngredients) => {
    const { generatedRecipes } = get();
    return generateRecipeFromIngredients(userIngredients, generatedRecipes);
  }
}));