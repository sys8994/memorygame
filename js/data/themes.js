const labeledItem = (emoji, ko, en) => ({
    type: 'labeled',
    emoji,
    label: { ko, en }
});

const flagItem = (code, ko, en) => ({
    type: 'flag',
    code,
    label: { ko, en }
});

export const themes = [
    {
        id: 'random',
        name: { ko: '랜덤 뽑기', en: 'Random' },
        icon: '🎲',
        cssClass: 'theme-random',
        items: []
    },
    {
        id: 'animals',
        name: { ko: '동물 친구들', en: 'Animals' },
        icon: '🦁',
        cssClass: 'theme-animals',
        items: [
            labeledItem('🐶', '강아지', 'Dog'),
            labeledItem('🐱', '고양이', 'Cat'),
            labeledItem('🐭', '생쥐', 'Mouse'),
            labeledItem('🐹', '햄스터', 'Hamster'),
            labeledItem('🐰', '토끼', 'Rabbit'),
            labeledItem('🦊', '여우', 'Fox'),
            labeledItem('🐻', '곰', 'Bear'),
            labeledItem('🐼', '판다', 'Panda'),
            labeledItem('🐨', '코알라', 'Koala'),
            labeledItem('🐯', '호랑이', 'Tiger'),
            labeledItem('🦁', '사자', 'Lion'),
            labeledItem('🐮', '소', 'Cow'),
            labeledItem('🐷', '돼지', 'Pig'),
            labeledItem('🐸', '개구리', 'Frog'),
            labeledItem('🐵', '원숭이', 'Monkey'),
            labeledItem('🦉', '부엉이', 'Owl')
        ]
    },
    {
        id: 'fruits',
        name: { ko: '과일', en: 'Fruits' },
        icon: '🍎',
        cssClass: 'theme-fruits',
        items: [
            labeledItem('🍎', '사과', 'Apple'),
            labeledItem('🍐', '배', 'Pear'),
            labeledItem('🍊', '귤', 'Tangerine'),
            labeledItem('🍋', '레몬', 'Lemon'),
            labeledItem('🍌', '바나나', 'Banana'),
            labeledItem('🍉', '수박', 'Watermelon'),
            labeledItem('🍇', '포도', 'Grapes'),
            labeledItem('🍓', '딸기', 'Strawberry'),
            labeledItem('🍈', '메론', 'Melon'),
            labeledItem('🍒', '체리', 'Cherry'),
            labeledItem('🍑', '복숭아', 'Peach'),
            labeledItem('🥭', '망고', 'Mango'),
            labeledItem('🍍', '파인애플', 'Pineapple'),
            labeledItem('🥥', '코코넛', 'Coconut'),
            labeledItem('🥝', '키위', 'Kiwi'),
            labeledItem('🍅', '토마토', 'Tomato')
        ]
    },
    {
        id: 'foods',
        name: { ko: '음식', en: 'Foods' },
        icon: '🍽️',
        cssClass: 'theme-foods',
        items: [
            labeledItem('🍔', '햄버거', 'Burger'),
            labeledItem('🍕', '피자', 'Pizza'),
            labeledItem('🍟', '감자튀김', 'Fries'),
            labeledItem('🌭', '핫도그', 'Hot Dog'),
            labeledItem('🍜', '국수', 'Noodles'),
            labeledItem('🍙', '주먹밥', 'Rice Ball'),
            labeledItem('🍣', '초밥', 'Sushi'),
            labeledItem('🍞', '빵', 'Bread'),
            labeledItem('🧀', '치즈', 'Cheese'),
            labeledItem('🍪', '쿠키', 'Cookie'),
            labeledItem('🍩', '도넛', 'Donut'),
            labeledItem('🧁', '컵케이크', 'Cupcake'),
            labeledItem('🍦', '아이스크림', 'Ice Cream'),
            labeledItem('🍫', '초콜릿', 'Chocolate'),
            labeledItem('🍿', '팝콘', 'Popcorn'),
            labeledItem('🥞', '팬케이크', 'Pancake')
        ]
    },
    {
        id: 'sea',
        name: { ko: '바다 동물', en: 'Sea Animals' },
        icon: '🐬',
        cssClass: 'theme-sea',
        items: [
            labeledItem('🐠', '물고기', 'Fish'),
            labeledItem('🐟', '생선', 'Blue Fish'),
            labeledItem('🐡', '복어', 'Puffer Fish'),
            labeledItem('🦈', '상어', 'Shark'),
            labeledItem('🐬', '돌고래', 'Dolphin'),
            labeledItem('🐳', '고래', 'Whale'),
            labeledItem('🐙', '문어', 'Octopus'),
            labeledItem('🦑', '오징어', 'Squid'),
            labeledItem('🦀', '게', 'Crab'),
            labeledItem('🦞', '가재', 'Lobster'),
            labeledItem('🦐', '새우', 'Shrimp'),
            labeledItem('🐚', '조개', 'Shell'),
            labeledItem('🪼', '해파리', 'Jellyfish'),
            labeledItem('⭐', '불가사리', 'Starfish'),
            labeledItem('🐢', '바다거북', 'Sea Turtle'),
            labeledItem('🪸', '산호', 'Coral')
        ]
    },
    {
        id: 'flowers',
        name: { ko: '꽃과 식물', en: 'Flowers' },
        icon: '🌷',
        cssClass: 'theme-flowers',
        items: [
            labeledItem('🌹', '장미', 'Rose'),
            labeledItem('🌷', '튤립', 'Tulip'),
            labeledItem('🌻', '해바라기', 'Sunflower'),
            labeledItem('🌼', '꽃', 'Flower'),
            labeledItem('🪻', '라벤더', 'Lavender'),
            labeledItem('🪷', '연꽃', 'Lotus'),
            labeledItem('🌺', '무궁화', 'Hibiscus'),
            labeledItem('🌸', '벚꽃', 'Cherry Blossom'),
            labeledItem('🌱', '새싹', 'Sprout'),
            labeledItem('🪴', '화분', 'Plant Pot'),
            labeledItem('🌿', '풀잎', 'Leaf'),
            labeledItem('🍀', '클로버', 'Clover'),
            labeledItem('🌵', '선인장', 'Cactus'),
            labeledItem('🌲', '소나무', 'Pine Tree'),
            labeledItem('🌳', '나무', 'Tree'),
            labeledItem('🍄', '버섯', 'Mushroom')
        ]
    },
    {
        id: 'weather',
        name: { ko: '날씨', en: 'Weather' },
        icon: '🌈',
        cssClass: 'theme-weather',
        items: [
            labeledItem('☀️', '해', 'Sun'),
            labeledItem('🌤️', '맑음', 'Sunny'),
            labeledItem('⛅', '구름', 'Cloud'),
            labeledItem('☁️', '흐림', 'Cloudy'),
            labeledItem('🌧️', '비', 'Rain'),
            labeledItem('⛈️', '천둥', 'Thunder'),
            labeledItem('🌩️', '번개', 'Lightning'),
            labeledItem('❄️', '눈', 'Snow'),
            labeledItem('☃️', '눈사람', 'Snowman'),
            labeledItem('🌪️', '바람', 'Wind'),
            labeledItem('🌫️', '안개', 'Fog'),
            labeledItem('🌈', '무지개', 'Rainbow'),
            labeledItem('🌙', '달', 'Moon'),
            labeledItem('⭐', '별', 'Star'),
            labeledItem('🌅', '해돋이', 'Sunrise'),
            labeledItem('🌇', '노을', 'Sunset')
        ]
    },
    {
        id: 'daily',
        name: { ko: '생활용품', en: 'Daily Items' },
        icon: '🧸',
        cssClass: 'theme-daily',
        items: [
            labeledItem('🪥', '칫솔', 'Toothbrush'),
            labeledItem('🧴', '로션', 'Lotion'),
            labeledItem('🧼', '비누', 'Soap'),
            labeledItem('🧽', '스펀지', 'Sponge'),
            labeledItem('🪣', '양동이', 'Bucket'),
            labeledItem('🧹', '빗자루', 'Broom'),
            labeledItem('🛏️', '침대', 'Bed'),
            labeledItem('🪑', '의자', 'Chair'),
            labeledItem('🛁', '욕조', 'Bath'),
            labeledItem('🧸', '인형', 'Teddy Bear'),
            labeledItem('🎒', '가방', 'Bag'),
            labeledItem('⌚', '시계', 'Watch'),
            labeledItem('🪞', '거울', 'Mirror'),
            labeledItem('🧻', '휴지', 'Tissue'),
            labeledItem('🍼', '젖병', 'Baby Bottle'),
            labeledItem('🛍️', '쇼핑백', 'Shopping Bag')
        ]
    },
    {
        id: 'jobs',
        name: { ko: '직업', en: 'Jobs' },
        icon: '🧑‍🚒',
        cssClass: 'theme-jobs',
        items: [
            labeledItem('👮', '경찰관', 'Police'),
            labeledItem('🧑‍🚒', '소방관', 'Firefighter'),
            labeledItem('👩‍⚕️', '의사', 'Doctor'),
            labeledItem('👨‍🍳', '요리사', 'Chef'),
            labeledItem('👩‍🏫', '선생님', 'Teacher'),
            labeledItem('🧑‍🌾', '농부', 'Farmer'),
            labeledItem('👷', '건설가', 'Builder'),
            labeledItem('🧑‍🎨', '화가', 'Painter'),
            labeledItem('🧑‍🚀', '우주인', 'Astronaut'),
            labeledItem('🧑‍✈️', '조종사', 'Pilot'),
            labeledItem('🧑‍🔧', '정비사', 'Mechanic'),
            labeledItem('🧑‍🔬', '과학자', 'Scientist'),
            labeledItem('🧑‍⚖️', '판사', 'Judge'),
            labeledItem('🧑‍🎤', '가수', 'Singer'),
            labeledItem('🧑‍💻', '개발자', 'Developer'),
            labeledItem('🕵️', '탐정', 'Detective')
        ]
    },
    {
        id: 'flags',
        name: { ko: '세계 국기', en: 'Flags' },
        icon: '🌍',
        cssClass: 'theme-flags',
        items: [
            flagItem('kr', '대한민국', 'Korea'),
            flagItem('us', '미국', 'United States'),
            flagItem('gb', '영국', 'United Kingdom'),
            flagItem('jp', '일본', 'Japan'),
            flagItem('cn', '중국', 'China'),
            flagItem('fr', '프랑스', 'France'),
            flagItem('de', '독일', 'Germany'),
            flagItem('it', '이탈리아', 'Italy'),
            flagItem('ca', '캐나다', 'Canada'),
            flagItem('br', '브라질', 'Brazil'),
            flagItem('au', '호주', 'Australia'),
            flagItem('es', '스페인', 'Spain'),
            flagItem('in', '인도', 'India'),
            flagItem('ru', '러시아', 'Russia'),
            flagItem('mx', '멕시코', 'Mexico'),
            flagItem('ch', '스위스', 'Switzerland')
        ]
    },
    {
        id: 'abc',
        name: { ko: '알파벳', en: 'Alphabet' },
        icon: '🔤',
        cssClass: 'theme-abc',
        items: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P']
    },
    {
        id: 'kr',
        name: { ko: '한글', en: 'Hangul' },
        icon: '가',
        cssClass: 'theme-kr',
        items: ['가', '나', '다', '라', '마', '바', '사', '아', '자', '차', '카', '타', '파', '하', '거', '너']
    },
    {
        id: 'numbers',
        name: { ko: '숫자', en: 'Numbers' },
        icon: '🔢',
        cssClass: 'theme-numbers',
        items: []
    },
    {
        id: 'vehicles',
        name: { ko: '탈것', en: 'Vehicles' },
        icon: '🚗',
        cssClass: 'theme-vehicles',
        items: [
            labeledItem('🚓', '경찰차', 'Police Car'),
            labeledItem('🚒', '소방차', 'Fire Truck'),
            labeledItem('🚑', '구급차', 'Ambulance'),
            labeledItem('🚌', '버스', 'Bus'),
            labeledItem('🚕', '택시', 'Taxi'),
            labeledItem('🚗', '자동차', 'Car'),
            labeledItem('🚆', '기차', 'Train'),
            labeledItem('✈️', '비행기', 'Airplane'),
            labeledItem('🚀', '로켓', 'Rocket'),
            labeledItem('🚢', '배', 'Ship'),
            labeledItem('🚲', '자전거', 'Bicycle'),
            labeledItem('🏍️', '오토바이', 'Motorbike'),
            labeledItem('🚁', '헬리콥터', 'Helicopter'),
            labeledItem('🚜', '트랙터', 'Tractor'),
            labeledItem('🚚', '트럭', 'Truck'),
            labeledItem('🛵', '스쿠터', 'Scooter')
        ]
    },
    {
        id: 'instruments',
        name: { ko: '악기', en: 'Instruments' },
        icon: '🎵',
        cssClass: 'theme-instruments',
        items: [
            labeledItem('🎹', '피아노', 'Piano'),
            labeledItem('🥁', '드럼', 'Drum'),
            labeledItem('🎸', '기타', 'Guitar'),
            labeledItem('🎻', '바이올린', 'Violin'),
            labeledItem('🎺', '트럼펫', 'Trumpet'),
            labeledItem('🎷', '색소폰', 'Saxophone'),
            labeledItem('🪗', '아코디언', 'Accordion'),
            labeledItem('🪕', '밴조', 'Banjo'),
            labeledItem('🪘', '콩가', 'Conga'),
            labeledItem('🎼', '악보', 'Sheet Music'),
            labeledItem('🎤', '마이크', 'Microphone'),
            labeledItem('📯', '나팔', 'Horn'),
            labeledItem('🪇', '마라카스', 'Maracas'),
            labeledItem('🔔', '방울', 'Bell'),
            labeledItem('🎶', '음표', 'Notes'),
            labeledItem('🎚️', '믹서', 'Mixer')
        ]
    },
    {
        id: 'buildings',
        name: { ko: '건물', en: 'Buildings' },
        icon: '🏠',
        cssClass: 'theme-buildings',
        items: [
            labeledItem('🏠', '집', 'House'),
            labeledItem('🏫', '학교', 'School'),
            labeledItem('🏥', '병원', 'Hospital'),
            labeledItem('🏪', '가게', 'Store'),
            labeledItem('🏬', '백화점', 'Mall'),
            labeledItem('🏢', '회사', 'Office'),
            labeledItem('🏛️', '박물관', 'Museum'),
            labeledItem('🏰', '성', 'Castle'),
            labeledItem('⛪', '교회', 'Church'),
            labeledItem('🕌', '사원', 'Temple'),
            labeledItem('🗼', '타워', 'Tower'),
            labeledItem('🏟️', '경기장', 'Stadium'),
            labeledItem('🏦', '은행', 'Bank'),
            labeledItem('🏨', '호텔', 'Hotel'),
            labeledItem('🏭', '공장', 'Factory'),
            labeledItem('🏘️', '마을', 'Village')
        ]
    },
    {
        id: 'custom',
        name: { ko: '내 사진', en: 'My Photos' },
        icon: '🖼️',
        cssClass: 'theme-custom',
        items: []
    }
];
