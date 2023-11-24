const convertStampToTime = (stamp) => {
  const date = new Date(stamp * 1000);

  return date.getHours() + ': ' + date.getMinutes();
};

const convertStampToDate = (stamp) => {
  const date = new Date(stamp * 1000);
  const monthNames = [
    {en: 'January', ua: 'Січень'},
    {en: 'February', ua: 'Лютий'},
    {en: 'March', ua: 'Березень'},
    {en: 'April', ua: 'Квітень'},
    {en: 'May', ua: 'Травень'},
    {en: 'June', ua: 'Червень'},
    {en: 'July', ua: 'Липень'},
    {en: 'August', ua: 'Серпень'},
    {en: 'September', ua: 'Вереснь'},
    {en: 'October', ua: 'Жовтень'},
    {en: 'November', ua: 'Листопад'},
    {en: 'December', ua: 'Грудень'},
  ];

  if (stamp)  {
     return monthNames[date.getMonth()][localStorage.getItem('lang') || 'en'] + ' ' + date.getDate();
  }
};

export { convertStampToTime, convertStampToDate };
