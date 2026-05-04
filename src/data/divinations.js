export const divinationResults = [
  {
    id: 1,
    hexagram: '乾为天',
    symbol: '☰',
    title: '元亨利贞',
    content: '天行健，君子以自强不息。',
    interpretation: '此卦为大吉之兆。问事业则蒸蒸日上，问财运则财源广进，问感情则姻缘美满。凡事顺风顺水，宜积极进取。',
    luckLevel: '大吉'
  },
  {
    id: 2,
    hexagram: '坤为地',
    symbol: '☷',
    title: '厚德载物',
    content: '地势坤，君子以厚德载物。',
    interpretation: '此卦主吉。宜守正持中，厚积薄发。问事业则稳中有进，问财运则细水长流，问感情则需以诚相待。',
    luckLevel: '吉'
  },
  {
    id: 3,
    hexagram: '水雷屯',
    symbol: '☳',
    title: '屯难之始',
    content: '刚柔始交而难生，动乎险中。',
    interpretation: '此卦为屯难之象。初逢困境，宜守不宜进。问事业则初遇阻碍，问财运则需谨慎投资，问感情则时机未到。',
    luckLevel: '平'
  },
  {
    id: 4,
    hexagram: '山水蒙',
    symbol: '☶',
    title: '蒙以养正',
    content: '匪我求童蒙，童蒙求我。',
    interpretation: '此卦为启蒙之兆。宜虚心学习，积累知识。问学业则进步显著，问事业则需拜师学艺，问感情则需坦诚沟通。',
    luckLevel: '吉'
  },
  {
    id: 5,
    hexagram: '水天需',
    symbol: '☰',
    title: '需待之时',
    content: '云上于天，需。君子以饮食宴乐。',
    interpretation: '此卦为等待之象。时机未到，宜静守待机。问事业则需耐心等待，问财运则不宜强求，问感情则缘分未到。',
    luckLevel: '平'
  },
  {
    id: 6,
    hexagram: '天水讼',
    symbol: '☵',
    title: '慎争戒讼',
    content: '天与水违行，讼。君子以作事谋始。',
    interpretation: '此卦为争讼之象。宜和不宜争，防口舌是非。问事业则需避免争执，问财运则谨防纠纷，问感情则需忍让包容。',
    luckLevel: '小凶'
  },
  {
    id: 7,
    hexagram: '地水师',
    symbol: '☲',
    title: '师出以律',
    content: '地中有水，师。君子以容民畜众。',
    interpretation: '此卦为出师之象。宜团结众人，严明纪律。问事业则适合团队合作，问财运则合伙经营有利，问感情则需相互扶持。',
    luckLevel: '吉'
  },
  {
    id: 8,
    hexagram: '水地比',
    symbol: '☷',
    title: '亲比和谐',
    content: '地上有水，比。先王以建万国，亲诸侯。',
    interpretation: '此卦为亲比之象。宜广结善缘，和睦相处。问事业则贵人相助，问财运则朋友提携，问感情则人缘极佳。',
    luckLevel: '大吉'
  },
  {
    id: 9,
    hexagram: '风天小畜',
    symbol: '☰',
    title: '密云不雨',
    content: '风行天上，小畜。君子以懿文德。',
    interpretation: '此卦为积蓄之象。宜韬光养晦，积累力量。问事业则储备实力，问财运则积少成多，问感情则静待花开。',
    luckLevel: '平'
  },
  {
    id: 10,
    hexagram: '天泽履',
    symbol: '☱',
    title: '履道坦坦',
    content: '上天下泽，履。君子以辨上下，定民志。',
    interpretation: '此卦为履行之象。宜循规蹈矩，步步为营。问事业则稳步前进，问财运则按部就班，问感情则循序渐进。',
    luckLevel: '吉'
  },
  {
    id: 11,
    hexagram: '地天泰',
    symbol: '☰',
    title: '天地交泰',
    content: '天地交，泰。后以财成天地之道。',
    interpretation: '此卦为大吉之兆。天地交泰，万物亨通。问事业则功成名就，问财运则金玉满堂，问感情则天作之合。',
    luckLevel: '大吉'
  },
  {
    id: 12,
    hexagram: '天地否',
    symbol: '☷',
    title: '否极泰来',
    content: '天地不交，否。君子以俭德辟难。',
    interpretation: '此卦为阻滞之象。否极泰来，物极必反。问事业则暂时受阻，问财运则需守财，问感情则需耐心等待转机。',
    luckLevel: '凶'
  }
];

export const getRandomDivination = () => {
  const randomIndex = Math.floor(Math.random() * divinationResults.length);
  return divinationResults[randomIndex];
};

export const getLuckColor = (level) => {
  const colors = {
    '大吉': 'text-vermilion-500',
    '吉': 'text-ink-700',
    '平': 'text-ink-500',
    '小凶': 'text-orange-500',
    '凶': 'text-red-600'
  };
  return colors[level] || 'text-ink-500';
};
