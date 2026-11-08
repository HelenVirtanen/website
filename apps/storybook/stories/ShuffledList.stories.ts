import ShuffledList from '@moscowcss/ui/components/ShuffledList';

export default {
  title: 'Components/ShuffledList',
  component: ShuffledList,
};

// Перезагрузите историю: пункты встанут в другом порядке.
export const Default = {
  args: {
    'aria-label': 'Сообщества',
    slots: { default: '<li>MoscowJS</li><li>Moscow QA</li><li>Msk Vue.js</li><li>reWorked</li><li>IT Event Hub</li>' },
  },
};
