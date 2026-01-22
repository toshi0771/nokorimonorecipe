import React, { useState, useEffect } from 'react';
import { useRecipeStore } from '../store/recipeStore';
import { UserIngredient } from '../types/recipe';
import { Plus, Trash2, ChefHat, BookOpen, Utensils } from 'lucide-react';

const RecipeApp: React.FC = () => {
  const {
    generatedRecipes,
    selectedRecipe,
    userIngredients,
    servings,
    selectedRecipeIds,
    setSelectedRecipe,
    addUserIngredient,
    removeUserIngredient,
    setServings,
    generateRecipesFromIngredients,
    removeRecipes,
    toggleRecipeSelection,
    clearSelections,
    generateNewRecipe
  } = useRecipeStore();

  const [ingredientInput, setIngredientInput] = useState('');

  // 材料が変更された時に自動でレシピを生成
  useEffect(() => {
    if (userIngredients.length > 0) {
      generateRecipesFromIngredients();
    }
  }, [userIngredients, generateRecipesFromIngredients]);

  // 材料を追加する関数
  const addIngredient = () => {
    if (ingredientInput.trim()) {
      const newIngredient: UserIngredient = {
        name: ingredientInput.trim(),
        amount: '適量'
      };
      addUserIngredient(newIngredient);
      setIngredientInput('');
    }
  };

  // 選択されたレシピを削除する関数
  const handleDeleteSelected = () => {
    if (selectedRecipeIds.size > 0) {
      removeRecipes(Array.from(selectedRecipeIds));
    }
  };

  // 新しいレシピを追加する関数
  const handleAddNewRecipe = () => {
    if (userIngredients.length > 0) {
      try {
        const newRecipe = generateNewRecipe(userIngredients);
        // 既存レシピに追加するのではなく、新しいレシピを生成してリストに追加
        generateRecipesFromIngredients();
      } catch (error) {
        console.warn('新しいレシピの生成に失敗しました');
      }
    }
  };

  // 人数に応じて分量を調整する関数
  const adjustIngredientAmount = (amount: string, originalServings: number, newServings: number): string => {
    const ratio = newServings / originalServings;
    
    // 数値部分を抽出して調整
    const match = amount.match(/^(\d+(?:\.\d+)?(?:\/\d+)?)/);
    if (match) {
      const numericPart = match[1];
      let value: number;
      
      if (numericPart.includes('/')) {
        const [numerator, denominator] = numericPart.split('/').map(Number);
        value = numerator / denominator;
      } else {
        value = parseFloat(numericPart);
      }
      
      const adjustedValue = value * ratio;
      const nonNumericPart = amount.replace(match[1], '');
      
      // 小数点以下1桁まで表示
      return adjustedValue % 1 === 0 
        ? `${adjustedValue}${nonNumericPart}`
        : `${adjustedValue.toFixed(1)}${nonNumericPart}`;
    }
    
    return amount;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            <ChefHat className="w-8 h-8 text-orange-500" />
            冷蔵庫残り物レシピ提案アプリ
          </h1>
        </div>

        {/* 使い方説明 */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-blue-800 mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            使い方
          </h2>
          <div className="text-blue-700 space-y-2">
            <p className="flex items-start gap-2">
              <span className="font-semibold">1.</span>
              <span>下の「材料と人数設定」で冷蔵庫にある材料を入力してください（例：キャベツ、卵、豆腐）</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="font-semibold">2.</span>
              <span>材料を入力すると、自動的に上の枠におすすめレシピが表示されます</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="font-semibold">3.</span>
              <span>レシピ名をクリックすると、右側に詳しい作り方が表示されます</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="font-semibold">4.</span>
              <span>人数を変更すると、材料の分量も自動で調整されます</span>
            </p>
          </div>
        </div>

        {/* メインコンテンツ：2カラムレイアウト */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左カラム */}
          <div className="space-y-6">
            {/* 上段：生成されたレシピ表示枠 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Utensils className="w-5 h-5 text-orange-500" />
                提案レシピ
                {generatedRecipes.length > 0 && (
                  <span className="text-sm text-gray-500 font-normal">
                    ({generatedRecipes.length}件)
                  </span>
                )}
              </h2>
              
              {generatedRecipes.length > 0 ? (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {generatedRecipes.map((recipe) => (
                    <div
                      key={recipe.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 flex items-center gap-3 ${
                        selectedRecipe?.id === recipe.id
                          ? 'border-orange-400 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300 hover:bg-orange-25'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedRecipeIds.has(recipe.id)}
                        onChange={() => toggleRecipeSelection(recipe.id)}
                        className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div
                        className="flex-1"
                        onClick={() => setSelectedRecipe(recipe)}
                      >
                        <h3 className="font-medium text-gray-800">{recipe.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span>🍽️ {recipe.servings}人前</span>
                          <span>⏰ {recipe.cookingTime}</span>
                          <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                            {recipe.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ChefHat className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p>材料を入力すると、ここにレシピが表示されます</p>
                </div>
              )}
            </div>

            {/* 下段：材料入力フォームと人数プルダウン */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">材料と人数設定</h2>
              
              {/* 人数選択 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  何人前？
                </label>
                <select
                  value={servings}
                  onChange={(e) => setServings(Number(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num}人前</option>
                  ))}
                </select>
              </div>

              {/* 材料入力 */}
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="材料名（例：キャベツ、卵、豆腐）"
                    value={ingredientInput}
                    onChange={(e) => setIngredientInput(e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    onKeyPress={(e) => e.key === 'Enter' && addIngredient()}
                  />
                  <button
                    onClick={addIngredient}
                    className="px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    追加
                  </button>
                </div>

                {/* 登録済み材料リスト */}
                {userIngredients.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-700">登録済み材料：</h3>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {userIngredients.map((ingredient, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-50 p-2 rounded-lg"
                        >
                          <span className="text-sm text-gray-700">
                            {ingredient.name}
                          </span>
                          <button
                            onClick={() => removeUserIngredient(index)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 右カラム：レシピ詳細 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            {selectedRecipe ? (
              <div>
                <div className="border-b border-gray-200 pb-4 mb-6">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    {selectedRecipe.name}
                  </h2>
                  <div className="flex items-center gap-4 text-gray-600">
                    <span>🍽️ {servings}人前</span>
                    <span>⏰ {selectedRecipe.cookingTime}</span>
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                      {selectedRecipe.category}
                    </span>
                  </div>
                </div>

                {/* 材料リスト */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">材料</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedRecipe.ingredients.map((ingredient, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="font-medium text-gray-700">
                          {ingredient.name}
                        </span>
                        <span className="text-gray-600">
                          {adjustIngredientAmount(ingredient.amount, selectedRecipe.servings, servings)}
                          {ingredient.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 作り方 */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">作り方</h3>
                  <div className="space-y-3">
                    {selectedRecipe.instructions.map((instruction, index) => (
                      <div
                        key={index}
                        className="flex gap-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </span>
                        <p className="text-gray-700 leading-relaxed">
                          {instruction}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-xl text-gray-500 mb-2">レシピを選択してください</p>
                <p className="text-gray-400">左側のメニューからレシピをクリックして詳細を表示</p>
              </div>
            )}
          </div>
        </div>

        {/* 下部ボタン */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <button
            onClick={handleAddNewRecipe}
            disabled={userIngredients.length === 0}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            新しいレシピを追加
          </button>
          
          <button
            onClick={handleDeleteSelected}
            disabled={selectedRecipeIds.size === 0}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
            選択したレシピを削除
          </button>
        </div>

        {/* ボタン使い方説明 */}
        <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-3 text-center">ボタンの使い方</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="text-center p-3 bg-white rounded-lg border border-gray-100">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Plus className="w-4 h-4 text-green-500" />
                <span className="font-medium text-green-600">新しいレシピを追加</span>
              </div>
              <p>登録した材料を使って、さらに新しいレシピを生成します。材料を入力している時のみ使用可能です。</p>
            </div>
            
            <div className="text-center p-3 bg-white rounded-lg border border-gray-100">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Trash2 className="w-4 h-4 text-red-500" />
                <span className="font-medium text-red-600">選択したレシピを削除</span>
              </div>
              <p>レシピの左端にあるチェックボックスで選択したレシピを一括削除します。削除後、選択は自動的にクリアされます。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeApp;