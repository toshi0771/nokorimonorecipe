import { Recipe } from '../types/recipe';

export const sampleRecipes: Recipe[] = [
  {
    id: '1',
    name: '野菜炒め',
    ingredients: [
      { name: 'キャベツ', amount: '200', unit: 'g' },
      { name: 'にんじん', amount: '1/2', unit: '本' },
      { name: 'もやし', amount: '100', unit: 'g' },
      { name: '醤油', amount: '大さじ2', unit: '' },
      { name: 'ごま油', amount: '大さじ1', unit: '' }
    ],
    instructions: [
      'キャベツを一口大に切る',
      'にんじんを千切りにする',
      'フライパンにごま油を熱し、にんじんを炒める',
      'キャベツともやしを加えて炒める',
      '醤油で味付けして完成'
    ],
    servings: 2,
    cookingTime: '15分',
    category: '野菜料理'
  },
  {
    id: '2', 
    name: '玉子焼き',
    ingredients: [
      { name: '卵', amount: '3', unit: '個' },
      { name: '醤油', amount: '小さじ1', unit: '' },
      { name: '砂糖', amount: '小さじ1', unit: '' },
      { name: '油', amount: '適量', unit: '' }
    ],
    instructions: [
      '卵を溶いて醤油と砂糖を加える',
      'フライパンに油を敷いて温める',
      '卵液を3回に分けて入れて巻く',
      '形を整えて完成'
    ],
    servings: 2,
    cookingTime: '10分',
    category: '卵料理'
  },
  {
    id: '3',
    name: 'チャーハン',
    ingredients: [
      { name: 'ご飯', amount: '茶碗2', unit: '杯' },
      { name: '卵', amount: '2', unit: '個' },
      { name: 'ねぎ', amount: '2', unit: '本' },
      { name: 'ハム', amount: '3', unit: '枚' },
      { name: '醤油', amount: '大さじ1.5', unit: '' },
      { name: 'ごま油', amount: '大さじ1', unit: '' }
    ],
    instructions: [
      'ご飯は冷ましておく',
      'ねぎを小口切り、ハムを細切りにする',
      'フライパンに油を熱し、溶き卵を炒める',
      'ご飯とハムを加えて炒める',
      'ねぎと醤油を加えて仕上げる'
    ],
    servings: 2,
    cookingTime: '12分',
    category: 'ご飯もの'
  },
  {
    id: '4',
    name: 'みそ汁',
    ingredients: [
      { name: '豆腐', amount: '1/2', unit: '丁' },
      { name: 'わかめ', amount: '大さじ1', unit: '' },
      { name: 'だしの素', amount: '小さじ1', unit: '' },
      { name: 'みそ', amount: '大さじ2', unit: '' },
      { name: '水', amount: '400', unit: 'ml' }
    ],
    instructions: [
      '豆腐を1cm角に切る',
      '鍋に水とだしの素を入れて沸騰させる',
      '豆腐とわかめを加える',
      'みそを溶かし入れて完成'
    ],
    servings: 2,
    cookingTime: '8分',
    category: '汁物'
  },
  {
    id: '5',
    name: 'オムライス',
    ingredients: [
      { name: 'ご飯', amount: '茶碗2', unit: '杯' },
      { name: '卵', amount: '4', unit: '個' },
      { name: '玉ねぎ', amount: '1/2', unit: '個' },
      { name: 'ソーセージ', amount: '3', unit: '本' },
      { name: 'ケチャップ', amount: '大さじ3', unit: '' },
      { name: 'バター', amount: '20', unit: 'g' }
    ],
    instructions: [
      '玉ねぎとソーセージを小さく切る',
      'フライパンでソーセージと玉ねぎを炒める',
      'ご飯とケチャップを加えて炒める',
      '卵でオムレツを作り、ケチャップライスを包む',
      'お皿に盛りつけて完成'
    ],
    servings: 2,
    cookingTime: '20分',
    category: 'ご飯もの'
  }
];

// レシピ生成用のバリエーション
export const recipeVariations = {
  野菜料理: [
    '野菜サラダ', '野菜の煮物', '野菜カレー', '野菜スープ', 'ラタトゥイユ'
  ],
  卵料理: [
    '目玉焼き', 'スクランブルエッグ', '茶碗蒸し', 'オムレツ', '親子丼'
  ],
  ご飯もの: [
    '焼きおにぎり', '雑炊', 'リゾット', 'ピラフ', '丼もの'
  ],
  汁物: [
    'コンソメスープ', '中華スープ', 'クリームスープ', '豚汁', 'けんちん汁'
  ]
};