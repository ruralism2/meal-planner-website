document.addEventListener('DOMContentLoaded', () => {
    console.log('스크립트가 로드되었습니다.');

    const recipes = [
        { name: '김치찌개', ingredients: ['김치', '돼지고기', '두부'], mealType: ['점심', '저녁'] },
        { name: '된장찌개', ingredients: ['된장', '두부', '애호박', '양파'], mealType: ['점심', '저녁'] },
        { name: '불고기', ingredients: ['소고기', '양파', '대파', '간장'], mealType: ['점심', '저녁'] },
        { name: '제육볶음', ingredients: ['돼지고기', '고추장', '양파', '대파'], mealType: ['점심', '저녁'] },
        { name: '계란찜', ingredients: ['계란', '파'], mealType: ['아침', '점심', '저녁'] },
        { name: '미역국', ingredients: ['미역', '소고기'], mealType: ['아침', '점심', '저녁'] },
        { name: '비빔밥', ingredients: ['밥', '계란', '각종 나물', '고추장'], mealType: ['점심', '저녁'] },
        { name: '닭볶음탕', ingredients: ['닭', '감자', '당근', '양파', '고추장'], mealType: ['점심', '저녁'] },
        { name: '갈비찜', ingredients: ['돼지갈비', '간장', '무', '당근'], mealType: ['점심', '저녁'] },
        { name: '콩나물국', ingredients: ['콩나물', '대파'], mealType: ['아침', '점심', '저녁'] },
        { name: '김치볶음밥', ingredients: ['밥', '김치', '햄', '계란'], mealType: ['점심', '저녁'] },
        { name: '참치김치찌개', ingredients: ['김치', '참치', '두부'], mealType: ['점심', '저녁'] },
        { name: '오므라이스', ingredients: ['밥', '계란', '양파', '햄', '케찹'], mealType: ['점심', '저녁'] },
        { name: '떡볶이', ingredients: ['떡', '어묵', '고추장', '대파'], mealType: ['점심', '저녁'] },
        { name: '카레라이스', ingredients: ['카레', '감자', '당근', '양파', '돼지고기'], mealType: ['점심', '저녁'] },
        { name: '순두부찌개', ingredients: ['순두부', '바지락', '계란', '고추기름'], mealType: ['점심', '저녁'] },
        { name: '김치전', ingredients: ['김치', '밀가루', '계란'], mealType: ['점심', '저녁'] },
        { name: '파전', ingredients: ['쪽파', '오징어', '밀가루', '계란'], mealType: ['점심', '저녁'] },
        { name: '두부조림', ingredients: ['두부', '간장', '대파'], mealType: ['점심', '저녁'] },
        { name: '콩나물밥', ingredients: ['밥', '콩나물', '간장'], mealType: ['점심', '저녁'] },
        { name: '만둣국', ingredients: ['만두', '계란', '대파'], mealType: ['점심', '저녁'] },
        { name: '잔치국수', ingredients: ['소면', '김치', '계란', '애호박'], mealType: ['점심', '저녁'] },
        { name: '김밥', ingredients: ['밥', '김', '계란', '햄', '시금치', '단무지'], mealType: ['점심'] },
        { name: '샌드위치', ingredients: ['식빵', '햄', '치즈', '계란', '상추'], mealType: ['아침', '점심'] },
        { name: '토스트', ingredients: ['식빵', '계란', '설탕'], mealType: ['아침'] },
        { name: '죽', ingredients: ['쌀', '참기름'], mealType: ['아침'] }
    ];

    const ingredientInput = document.getElementById('ingredient-input');
    const generatePlanBtn = document.getElementById('generate-plan-btn');
    const mealPlanContainer = document.getElementById('meal-plan-container');

    generatePlanBtn.addEventListener('click', generateMealPlan);

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function findMatchingRecipes(userIngredients, mealType) {
        let matched = recipes.filter(recipe => {
            // 요리 타입이 일치하는지 확인
            const typeMatches = recipe.mealType.includes(mealType);
            if (!typeMatches) return false;

            // 모든 필수 재료가 사용자의 냉장고에 있는지 확인
            const allIngredientsMatch = recipe.ingredients.every(reqIngredient =>
                userIngredients.some(userIng => userIng.includes(reqIngredient) || reqIngredient.includes(userIng))
            );
            return allIngredientsMatch;
        });
        return shuffleArray(matched); // 매번 다른 순서로 추천하기 위해 섞음
    }

    function createWeeklyPlan(userIngredients) {
        const weeklyPlan = [];
        const mealTypes = ['아침', '점심', '저녁'];
        const daysOfWeek = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];

        for (let i = 0; i < 7; i++) {
            const dayPlan = { day: daysOfWeek[i], 아침: [], 점심: [], 저녁: [] };
            mealTypes.forEach(type => {
                const recommended = findMatchingRecipes(userIngredients, type);
                // 최대 5가지 요리 추천 (없는 경우 0가지)
                dayPlan[type] = recommended.slice(0, 5).map(r => r.name);
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
                        html += `<li>${meal}</li>`;
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
