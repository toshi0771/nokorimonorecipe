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

// レシピ名に基づいた詳細なレシピ情報を生成
const getRecipeDetails = (recipeName: string, userIngredients: UserIngredient[]) => {
  const ingredientNames = userIngredients.map(ing => ing.name);
  
  // レシピ名に応じた具体的な調理法と材料を定義
  const recipeTemplates: { [key: string]: any } = {
    '野菜サラダ': {
      category: '野菜料理',
      cookingTime: '10分',
      additionalIngredients: [
        { name: 'レタス', amount: '2', unit: '枚' },
        { name: 'トマト', amount: '1', unit: '個' },
        { name: 'ドレッシング', amount: '大さじ2', unit: '' },
        { name: 'オリーブオイル', amount: '大さじ1', unit: '' }
      ],
      instructions: [
        `${ingredientNames.slice(0, 2).join('、')}を洗って食べやすい大きさに切る`,
        'レタスは手でちぎり、トマトはくし切りにする',
        'ボウルに野菜を入れて混ぜ合わせる',
        'ドレッシングとオリーブオイルをかける',
        '軽く混ぜて器に盛り付けて完成'
      ]
    },
    '野菜の煮物': {
      category: '野菜料理',
      cookingTime: '25分',
      additionalIngredients: [
        { name: '醤油', amount: '大さじ3', unit: '' },
        { name: 'みりん', amount: '大さじ2', unit: '' },
        { name: '砂糖', amount: '大さじ1', unit: '' },
        { name: 'だしの素', amount: '小さじ1', unit: '' },
        { name: '水', amount: '300', unit: 'ml' }
      ],
      instructions: [
        `${ingredientNames.join('、')}を一口大に切る`,
        '鍋に水とだしの素を入れて沸騰させる',
        '野菜を加えて中火で10分煮る',
        '醤油、みりん、砂糖を加える',
        'さらに10分煮込んで味を染み込ませて完成'
      ]
    },
    '野菜カレー': {
      category: '野菜料理',
      cookingTime: '30分',
      additionalIngredients: [
        { name: 'カレールー', amount: '4', unit: 'かけ' },
        { name: '水', amount: '600', unit: 'ml' },
        { name: 'サラダ油', amount: '大さじ1', unit: '' },
        { name: 'にんにく', amount: '1', unit: 'かけ' }
      ],
      instructions: [
        `${ingredientNames.join('、')}を一口大に切る`,
        'にんにくをみじん切りにする',
        '鍋に油を熱し、にんにくを炒める',
        '野菜を加えて炒め、水を加えて煮込む',
        '野菜が柔らかくなったらカレールーを加えて完成'
      ]
    },
    '野菜スープ': {
      category: '野菜料理',
      cookingTime: '20分',
      additionalIngredients: [
        { name: 'コンソメ', amount: '2', unit: '個' },
        { name: '水', amount: '600', unit: 'ml' },
        { name: '塩', amount: '少々', unit: '' },
        { name: 'こしょう', amount: '少々', unit: '' }
      ],
      instructions: [
        `${ingredientNames.join('、')}を食べやすい大きさに切る`,
        '鍋に水とコンソメを入れて沸騰させる',
        '野菜を加えて中火で15分煮る',
        '塩こしょうで味を整える',
        '器に盛り付けて完成'
      ]
    },
    'ラタトゥイユ': {
      category: '野菜料理',
      cookingTime: '35分',
      additionalIngredients: [
        { name: 'トマト缶', amount: '1', unit: '缶' },
        { name: 'にんにく', amount: '2', unit: 'かけ' },
        { name: 'オリーブオイル', amount: '大さじ2', unit: '' },
        { name: '塩', amount: '小さじ1', unit: '' },
        { name: 'ハーブ', amount: '適量', unit: '' }
      ],
      instructions: [
        `${ingredientNames.join('、')}を1cm角に切る`,
        'にんにくをみじん切りにする',
        'フライパンにオリーブオイルとにんにくを入れて香りを出す',
        '野菜を加えて炒め、トマト缶を加える',
        '弱火で20分煮込み、塩とハーブで味を整えて完成'
      ]
    },
    '目玉焼き': {
      category: '卵料理',
      cookingTime: '5分',
      additionalIngredients: [
        { name: '卵', amount: '2', unit: '個' },
        { name: '油', amount: '適量', unit: '' },
        { name: '塩', amount: '少々', unit: '' },
        { name: 'こしょう', amount: '少々', unit: '' }
      ],
      instructions: [
        'フライパンに油を熱する',
        '卵を割り入れる',
        '弱火でゆっくり焼く',
        '塩こしょうをふる',
        '好みの固さになったら完成'
      ]
    },
    'スクランブルエッグ': {
      category: '卵料理',
      cookingTime: '8分',
      additionalIngredients: [
        { name: '卵', amount: '3', unit: '個' },
        { name: '牛乳', amount: '大さじ2', unit: '' },
        { name: 'バター', amount: '10', unit: 'g' },
        { name: '塩', amount: '少々', unit: '' },
        { name: 'こしょう', amount: '少々', unit: '' }
      ],
      instructions: [
        '卵を溶いて牛乳、塩、こしょうを加える',
        'フライパンにバターを溶かす',
        '卵液を流し入れる',
        'ゆっくりかき混ぜながら半熟状にする',
        '火を止めて余熱で仕上げて完成'
      ]
    },
    '茶碗蒸し': {
      category: '卵料理',
      cookingTime: '20分',
      additionalIngredients: [
        { name: '卵', amount: '2', unit: '個' },
        { name: 'だし汁', amount: '300', unit: 'ml' },
        { name: '醤油', amount: '小さじ1', unit: '' },
        { name: 'みりん', amount: '小さじ1', unit: '' },
        { name: 'かまぼこ', amount: '2', unit: '切れ' }
      ],
      instructions: [
        '卵を溶いてだし汁、醤油、みりんを加える',
        '茶碗に具材を入れる',
        '卵液を茶碗に注ぎ、濾す',
        '蒸し器で15分蒸す',
        '竹串を刺して透明な汁が出たら完成'
      ]
    },
    'オムレツ': {
      category: '卵料理',
      cookingTime: '10分',
      additionalIngredients: [
        { name: '卵', amount: '3', unit: '個' },
        { name: '牛乳', amount: '大さじ2', unit: '' },
        { name: 'バター', amount: '15', unit: 'g' },
        { name: '塩', amount: '少々', unit: '' },
        { name: 'こしょう', amount: '少々', unit: '' }
      ],
      instructions: [
        `${ingredientNames.filter(ing => ing !== '卵').slice(0, 2).join('、')}を細かく切る`,
        '卵を溶いて牛乳、塩、こしょうを加える',
        'フライパンにバターを溶かし、具材を炒める',
        '卵液を流し入れて半熟状にする',
        '半分に折りたたんで形を整えて完成'
      ]
    },
    '親子丼': {
      category: '卵料理',
      cookingTime: '15分',
      additionalIngredients: [
        { name: '卵', amount: '3', unit: '個' },
        { name: '鶏肉', amount: '150', unit: 'g' },
        { name: '玉ねぎ', amount: '1/2', unit: '個' },
        { name: '醤油', amount: '大さじ2', unit: '' },
        { name: 'みりん', amount: '大さじ2', unit: '' },
        { name: 'だし汁', amount: '100', unit: 'ml' },
        { name: 'ご飯', amount: '2', unit: '杯' }
      ],
      instructions: [
        '鶏肉と玉ねぎを食べやすい大きさに切る',
        'フライパンにだし汁、醤油、みりんを入れて煮立てる',
        '鶏肉と玉ねぎを加えて煮る',
        '溶き卵を回し入れて半熟状にする',
        'ご飯の上にのせて完成'
      ]
    },
    '焼きおにぎり': {
      category: 'ご飯もの',
      cookingTime: '12分',
      additionalIngredients: [
        { name: 'ご飯', amount: '茶碗2', unit: '杯' },
        { name: '醤油', amount: '大さじ1', unit: '' },
        { name: 'ごま油', amount: '大さじ1', unit: '' },
        { name: '塩', amount: '少々', unit: '' }
      ],
      instructions: [
        `${ingredientNames.slice(0, 2).join('、')}を細かく刻む`,
        'ご飯に具材と塩を混ぜる',
        'おにぎりの形に握る',
        'フライパンにごま油を熱し、おにぎりを焼く',
        '醤油を塗って両面をこんがり焼いて完成'
      ]
    },
    '雑炊': {
      category: 'ご飯もの',
      cookingTime: '15分',
      additionalIngredients: [
        { name: 'ご飯', amount: '茶碗1', unit: '杯' },
        { name: '卵', amount: '1', unit: '個' },
        { name: 'だし汁', amount: '400', unit: 'ml' },
        { name: '醤油', amount: '大さじ1', unit: '' },
        { name: 'ねぎ', amount: '適量', unit: '' }
      ],
      instructions: [
        `${ingredientNames.slice(0, 2).join('、')}を食べやすい大きさに切る`,
        '鍋にだし汁を入れて沸騰させる',
        '具材とご飯を加えて煮る',
        '溶き卵を回し入れる',
        '醤油で味を整え、ねぎを散らして完成'
      ]
    },
    'リゾット': {
      category: 'ご飯もの',
      cookingTime: '20分',
      additionalIngredients: [
        { name: 'ご飯', amount: '茶碗2', unit: '杯' },
        { name: 'コンソメ', amount: '1', unit: '個' },
        { name: '牛乳', amount: '200', unit: 'ml' },
        { name: 'バター', amount: '20', unit: 'g' },
        { name: 'チーズ', amount: '30', unit: 'g' }
      ],
      instructions: [
        `${ingredientNames.slice(0, 2).join('、')}を小さく切る`,
        'フライパンにバターを溶かし、具材を炒める',
        'ご飯を加えて炒める',
        '牛乳とコンソメを加えて煮込む',
        'チーズを加えて混ぜ、とろみがついたら完成'
      ]
    },
    'ピラフ': {
      category: 'ご飯もの',
      cookingTime: '18分',
      additionalIngredients: [
        { name: 'ご飯', amount: '茶碗2', unit: '杯' },
        { name: 'コンソメ', amount: '1', unit: '個' },
        { name: 'バター', amount: '15', unit: 'g' },
        { name: '塩', amount: '少々', unit: '' },
        { name: 'こしょう', amount: '少々', unit: '' }
      ],
      instructions: [
        `${ingredientNames.join('、')}を小さく切る`,
        'フライパンにバターを溶かし、具材を炒める',
        'ご飯を加えて炒める',
        'コンソメを砕いて加える',
        '塩こしょうで味を整えて完成'
      ]
    },
    '丼もの': {
      category: 'ご飯もの',
      cookingTime: '15分',
      additionalIngredients: [
        { name: 'ご飯', amount: '茶碗2', unit: '杯' },
        { name: '醤油', amount: '大さじ2', unit: '' },
        { name: 'みりん', amount: '大さじ1', unit: '' },
        { name: '砂糖', amount: '小さじ1', unit: '' },
        { name: 'だし汁', amount: '100', unit: 'ml' }
      ],
      instructions: [
        `${ingredientNames.join('、')}を食べやすい大きさに切る`,
        'フライパンにだし汁、醤油、みりん、砂糖を入れる',
        '具材を加えて煮る',
        '具材に火が通るまで煮込む',
        'ご飯の上にのせて完成'
      ]
    },
    'コンソメスープ': {
      category: '汁物',
      cookingTime: '15分',
      additionalIngredients: [
        { name: 'コンソメ', amount: '2', unit: '個' },
        { name: '水', amount: '600', unit: 'ml' },
        { name: '塩', amount: '少々', unit: '' },
        { name: 'こしょう', amount: '少々', unit: '' },
        { name: 'パセリ', amount: '適量', unit: '' }
      ],
      instructions: [
        `${ingredientNames.join('、')}を1cm角に切る`,
        '鍋に水とコンソメを入れて沸騰させる',
        '具材を加えて中火で10分煮る',
        '塩こしょうで味を整える',
        'パセリを散らして完成'
      ]
    },
    '中華スープ': {
      category: '汁物',
      cookingTime: '12分',
      additionalIngredients: [
        { name: '鶏がらスープの素', amount: '大さじ1', unit: '' },
        { name: '水', amount: '600', unit: 'ml' },
        { name: '醤油', amount: '小さじ1', unit: '' },
        { name: 'ごま油', amount: '小さじ1', unit: '' },
        { name: 'ねぎ', amount: '適量', unit: '' }
      ],
      instructions: [
        `${ingredientNames.slice(0, 2).join('、')}を薄切りにする`,
        '鍋に水と鶏がらスープの素を入れて沸騰させる',
        '具材を加えて煮る',
        '醤油とごま油で味を整える',
        'ねぎを散らして完成'
      ]
    },
    'クリームスープ': {
      category: '汁物',
      cookingTime: '20分',
      additionalIngredients: [
        { name: '牛乳', amount: '400', unit: 'ml' },
        { name: 'コンソメ', amount: '1', unit: '個' },
        { name: 'バター', amount: '20', unit: 'g' },
        { name: '小麦粉', amount: '大さじ2', unit: '' },
        { name: '塩', amount: '少々', unit: '' },
        { name: 'こしょう', amount: '少々', unit: '' }
      ],
      instructions: [
        `${ingredientNames.join('、')}を小さく切る`,
        'フライパンにバターを溶かし、小麦粉を炒める',
        '牛乳を少しずつ加えてとろみをつける',
        'コンソメと具材を加えて煮る',
        '塩こしょうで味を整えて完成'
      ]
    },
    '豚汁': {
      category: '汁物',
      cookingTime: '25分',
      additionalIngredients: [
        { name: '豚肉', amount: '100', unit: 'g' },
        { name: 'だし汁', amount: '600', unit: 'ml' },
        { name: 'みそ', amount: '大さじ3', unit: '' },
        { name: 'ごま油', amount: '小さじ1', unit: '' }
      ],
      instructions: [
        `${ingredientNames.join('、')}と豚肉を食べやすい大きさに切る`,
        '鍋にごま油を熱し、豚肉を炒める',
        'だし汁を加えて沸騰させる',
        '野菜を加えて15分煮る',
        'みそを溶かし入れて完成'
      ]
    },
    'けんちん汁': {
      category: '汁物',
      cookingTime: '20分',
      additionalIngredients: [
        { name: '豆腐', amount: '1/2', unit: '丁' },
        { name: 'だし汁', amount: '600', unit: 'ml' },
        { name: '醤油', amount: '大さじ2', unit: '' },
        { name: 'ごま油', amount: '大さじ1', unit: '' }
      ],
      instructions: [
        `${ingredientNames.join('、')}を食べやすい大きさに切る`,
        '鍋にごま油を熱し、野菜を炒める',
        'だし汁を加えて沸騰させる',
        '豆腐を加えて10分煮る',
        '醤油で味を整えて完成'
      ]
    }
  };

  return recipeTemplates[recipeName] || null;
};

// 材料に基づいたレシピ生成関数
const generateRecipeFromIngredients = (userIngredients: UserIngredient[], existingRecipes: Recipe[] = []): Recipe => {
  if (userIngredients.length === 0) {
    throw new Error('材料が入力されていません');
  }

  // ユーザーの材料に基づいてカテゴリを推定
  const ingredientNames = userIngredients.map(ing => ing.name.toLowerCase());
  let possibleCategories: string[] = [];
  
  // 材料から作れそうなカテゴリを判定
  const hasVegetables = ingredientNames.some(name => 
    name.includes('野菜') || name.includes('キャベツ') || name.includes('にんじん') || 
    name.includes('玉ねぎ') || name.includes('ピーマン') || name.includes('なす') ||
    name.includes('トマト') || name.includes('じゃがいも') || name.includes('ジャガイモ')
  );
  
  const hasEgg = ingredientNames.some(name => name.includes('卵'));
  const hasRice = ingredientNames.some(name => name.includes('ご飯') || name.includes('米'));
  const hasSoup = ingredientNames.some(name => 
    name.includes('豆腐') || name.includes('わかめ') || name.includes('ねぎ')
  );
  
  if (hasVegetables) possibleCategories.push('野菜料理');
  if (hasEgg) possibleCategories.push('卵料理');
  if (hasRice) possibleCategories.push('ご飯もの');
  if (hasSoup) possibleCategories.push('汁物');
  
  // カテゴリが見つからない場合はデフォルトで野菜料理
  if (possibleCategories.length === 0) {
    possibleCategories = ['野菜料理'];
  }
  
  // 既存のレシピと重複しないカテゴリとレシピ名を選択
  let selectedRecipeName = '';
  let selectedCategory = '';
  let attempts = 0;
  const maxAttempts = 50;
  
  while (attempts < maxAttempts) {
    // ランダムにカテゴリを選択
    selectedCategory = possibleCategories[Math.floor(Math.random() * possibleCategories.length)];
    const variations = recipeVariations[selectedCategory as keyof typeof recipeVariations];
    
    // ランダムにレシピ名を選択
    selectedRecipeName = variations[Math.floor(Math.random() * variations.length)];
    
    // 既存のレシピと重複していないかチェック
    if (!existingRecipes.some(recipe => recipe.name === selectedRecipeName)) {
      break;
    }
    
    attempts++;
  }
  
  // レシピの詳細を取得
  const recipeDetails = getRecipeDetails(selectedRecipeName, userIngredients);
  
  if (!recipeDetails) {
    throw new Error('レシピの生成に失敗しました');
  }
  
  // ユーザー材料をベースとしてレシピ材料を作成
  const baseIngredients = userIngredients.slice(0, 3).map(ui => ({
    name: ui.name,
    amount: ui.amount || '適量',
    unit: ''
  }));
  
  return {
    id: `generated-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: selectedRecipeName,
    ingredients: [...baseIngredients, ...recipeDetails.additionalIngredients],
    instructions: recipeDetails.instructions,
    servings: 2,
    cookingTime: recipeDetails.cookingTime,
    category: recipeDetails.category
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
    
    // 材料に基づいて3つの異なるレシピを生成
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
