export function formatDate(date, locale = 'en') {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return '';
  }

  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  };

  return date.toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', options);
}
