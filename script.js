document.addEventListener('DOMContentLoaded', () => {
    console.log('스크립트가 로드되었습니다.');

    const recipes = [
        // 찌개 및 탕류
        { name: '김치찌개', ingredients: ['김치', '돼지고기', '두부'], mealType: ['아침', '점심', '저녁'], url: 'https://www.10000recipe.com/recipe/6852466' },
        { name: '된장찌개', ingredients: ['된장', '두부', '애호박'], mealType: ['아침', '점심', '저녁'], url: 'https://www.10000recipe.com/recipe/6884246' },
        { name: '순두부찌개', ingredients: ['순두부', '계란', '고춧가루'], mealType: ['아침', '점심', '저녁'], url: 'https://www.10000recipe.com/recipe/6856073' },
        { name: '부대찌개', ingredients: ['김치', '햄', '소시지', '라면사리'], mealType: ['점심', '저녁'], url: 'https://www.10000recipe.com/recipe/6929845' },
        { name: '동태찌개', ingredients: ['동태', '무', '고춧가루'], mealType: ['저녁'], url: 'https://www.10000recipe.com/recipe/6869822' },
        { name: '갈비탕', ingredients: ['소갈비', '무', '대파'], mealType: ['아침', '점심', '저녁'], url: 'https://www.10000recipe.com/recipe/6842323' },
        { name: '닭볶음탕', ingredients: ['닭', '감자', '당근', '고추장'], mealType: ['점심', '저녁'], url: 'https://www.10000recipe.com/recipe/6842323' },
        { name: '콩나물국', ingredients: ['콩나물', '대파', '소금'], mealType: ['아침'], url: 'https://www.10000recipe.com/recipe/6842323' },
        { name: '미역국', ingredients: ['미역', '소고기', '국간장'], mealType: ['아침', '저녁'], url: 'https://www.10000recipe.com/recipe/6842323' },
        
        // 구이 및 볶음류
        { name: '제육볶음', ingredients: ['돼지고기', '고추장', '양파'], mealType: ['점심', '저녁'], url: 'https://www.10000recipe.com/recipe/6854930' },
        { name: '소불고기', ingredients: ['소고기', '간장', '양파', '버섯'], mealType: ['점심', '저녁'], url: 'https://www.10000recipe.com/recipe/6842323' },
        { name: '오징어볶음', ingredients: ['오징어', '고추장', '양파', '대파'], mealType: ['점심', '저녁'], url: 'https://www.10000recipe.com/recipe/6842323' },
        { name: '닭갈비', ingredients: ['닭', '고구마', '양배추', '고추장'], mealType: ['점심', '저녁'], url: 'https://www.10000recipe.com/recipe/6842323' },
        { name: '고등어구이', ingredients: ['고등어', '소금'], mealType: ['아침', '점심', '저녁'], url: 'https://www.10000recipe.com/recipe/6842323' },
        { name: '삼겹살구이', ingredients: ['삼겹살', '상추', '마늘'], mealType: ['저녁'], url: 'https://www.10000recipe.com/recipe/6842323' },
        { name: '가지볶음', ingredients: ['가지', '간장', '양파'], mealType: ['점심', '저녁'], url: 'https://www.10000recipe.com/recipe/6842323' },
        { name: '멸치볶음', ingredients: ['멸치', '간장', '설탕', '견과류'], mealType: ['아침', '점심', '저녁'], url: 'https://www.10000recipe.com/recipe/6842323' },
        { name: '감자채볶음', ingredients: ['감자', '양파', '소금'], mealType: ['아침', '점심', '저녁'], url: 'https://www.10000recipe.com/recipe/6842323' },

        // 조림 및 찜류
        { name: '계란찜', ingredients: ['계란', '새우젓', '대파'], mealType: ['아침', '점심', '저녁'], url: 'https://www.10000recipe.com/recipe/6842323' },
        { name: '두부조림', ingredients: ['두부', '간장', '고춧가루'], mealType: ['아침', '점심', '저녁'], url: 'https://www.10000recipe.com/recipe/6842323' },
        { name: '감자조림', ingredients: ['감자', '간장', '설탕'], mealType: ['아침', '점심', '저녁'], url: 'https://www.10000recipe.com/recipe/6842323' },
        { name: '갈비찜', ingredients: ['돼지갈비', '간장', '무', '당근'], mealType: ['저녁'], url: 'https://www.10000recipe.com/recipe/6842323' },
        { name: '안동찜닭', ingredients: ['닭', '감자', '당면', '간장'], mealType: ['저녁'], url: 'https://www.10000recipe.com/recipe/6842323' },

        // 밥 및 면류
        { name: '김치볶음밥', ingredients: ['밥', '김치', '계란', '햄'], mealType: ['아침', '점심'], url: 'https://www.10000recipe.com/recipe/6842323' },
        { name: '비빔밥', ingredients: ['밥', '계란', '시금치', '콩나물', '고추장'], mealType: ['점심', '저녁'], url: 'https://www.10000recipe.com/recipe/6842323' },
        { name: '카레라이스', ingredients: ['밥', '카레', '감자', '당근', '돼지고기'], mealType: ['점심', '저녁'], url: 'https://www.10000recipe.com/recipe/6842323' },
        { name: '잔치국수', ingredients: ['소면', '계란', '애호박', '국간장'], mealType: ['점심'], url: 'https://www.10000recipe.com/recipe/6842323' },
        { name: '떡볶이', ingredients: ['떡', '어묵', '고추장', '대파'], mealType: ['점심', '저녁'], url: 'https://www.10000recipe.com/recipe/6842323' },
        { name: '김밥', ingredients: ['밥', '김', '단무지', '햄', '시금치'], mealType: ['점심'], url: 'https://www.10000recipe.com/recipe/6842323' },

        // 기타
        { name: '계란말이', ingredients: ['계란', '당근', '대파', '소금'], mealType: ['아침', '점심', '저녁'], url: 'https://www.10000recipe.com/recipe/6842323' },
        { name: '잡채', ingredients: ['당면', '시금치', '당근', '돼지고기'], mealType: ['점심', '저녁'], url: 'https://www.10000recipe.com/recipe/6842323' },
        { name: '애호박전', ingredients: ['애호박', '밀가루', '계란'], mealType: ['점심', '저녁'], url: 'https://www.10000recipe.com/recipe/6842323' },
        { name: '김치전', ingredients: ['김치', '밀가루', '오징어'], mealType: ['점심', '저녁'], url: 'https://www.10000recipe.com/recipe/6842323' },
        { name: '시금치나물', ingredients: ['시금치', '국간장', '참기름'], mealType: ['아침', '점심', '저녁'], url: 'https://www.10000recipe.com/recipe/6842323' },
        { name: '콩나물무침', ingredients: ['콩나물', '고춧가루', '참기름'], mealType: ['아침', '점심', '저녁'], url: 'https://www.10000recipe.com/recipe/6842323' },
        { name: '토스트', ingredients: ['식빵', '계란', '설탕'], mealType: ['아침'], url: 'https://www.10000recipe.com/recipe/6842323' },
        { name: '샌드위치', ingredients: ['식빵', '햄', '치즈', '상추'], mealType: ['아침', '점심'], url: 'https://www.10000recipe.com/recipe/6842323' }
    ];

    const ingredientInput = document.getElementById('ingredient-input');
    const generatePlanBtn = document.getElementById('generate-plan-btn');
    const mealPlanContainer = document.getElementById('meal-plan-container');

    generatePlanBtn.addEventListener('click', generateMealPlan);

function findMatchingRecipes(userIngredients, mealType) {
        const scoredRecipes = recipes
            .filter(recipe => recipe.mealType.includes(mealType)) // 1. 식사 종류로 먼저 필터링
            .map(recipe => {
                // 2. 각 레시피의 점수 계산
                const matchedIngredients = recipe.ingredients.filter(reqIngredient =>
                    userIngredients.some(userIng => userIng.includes(reqIngredient) || reqIngredient.includes(userIng))
                );
                const matchScore = matchedIngredients.length;
                const missingCount = recipe.ingredients.length - matchScore;

                return { ...recipe, matchScore, missingCount };
            })
            .filter(recipe => recipe.matchScore > 0); // 3. 일치하는 재료가 하나라도 있는 레시피만 선택

        // 4. 가장 일치하는 재료가 많고, 그 다음으로 부족한 재료가 적은 순으로 정렬
        scoredRecipes.sort((a, b) => {
            if (b.matchScore !== a.matchScore) {
                return b.matchScore - a.matchScore;
            }
            return a.missingCount - b.missingCount;
        });

        return scoredRecipes;
    }

    function createWeeklyPlan(userIngredients) {
        const weeklyPlan = [];
        const mealTypes = ['아침', '점심', '저녁'];
        const daysOfWeek = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];

        for (let i = 0; i < 7; i++) {
            const dayPlan = { day: daysOfWeek[i], 아침: [], 점심: [], 저녁: [] };
            mealTypes.forEach(type => {
                const recommended = findMatchingRecipes(userIngredients, type);
                // 최대 5가지 요리 추천 (객체 전체를 전달)
                dayPlan[type] = recommended.slice(0, 5);
            });
            weeklyPlan.push(dayPlan);
        }
        return weeklyPlan;
    }

    function displayMealPlan(weeklyPlan) {
        let html = '<h2>주간 식단표</h2>';
        html += '<table>';
        html += '<thead><tr><th>요일</th><th>아침</th><th>점심</th><th>저녁</th></tr></thead>';
        html += '<tbody>';

        weeklyPlan.forEach(dayPlan => {
            html += `<tr>`;
            html += `<td>${dayPlan.day}</td>`;
            
            ['아침', '점심', '저녁'].forEach(type => {
                html += `<td>`;
                if (dayPlan[type].length > 0) {
                    html += `<ul>`;
                    dayPlan[type].forEach(meal => {
                        // 요리법 URL이 있는 경우, 링크 생성
                        html += `<li><a href="${meal.url}" target="_blank" rel="noopener noreferrer">${meal.name}</a></li>`;
                    });
                    html += `</ul>`;
                } else {
                    html += `추천 요리 없음`;
                }
                html += `</td>`;
            });
            html += `</tr>`;
        });

        html += '</tbody>';
        html += '</table>';
        mealPlanContainer.innerHTML = html;
    }

    function generateMealPlan() {
        mealPlanContainer.innerHTML = ''; // 기존 식단표 초기화
        const userIngredients = ingredientInput.value.split(',').map(item => item.trim()).filter(item => item !== '');

        if (userIngredients.length === 0) {
            alert('냉장고 속 재료를 입력해주세요!');
            return;
        }

        const weeklyPlan = createWeeklyPlan(userIngredients);
        displayMealPlan(weeklyPlan);
    }
});
