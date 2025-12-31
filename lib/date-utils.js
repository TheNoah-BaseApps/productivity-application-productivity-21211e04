export function formatDate(dateString, includeTime = false) {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return '';
    }

    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };

    if (includeTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
    }

    return new Intl.DateTimeFormat('en-US', options).format(date);
  } catch (error) {
    console.error('Date formatting error:', error);
    return '';
  }
}

export function calculateDateDifference(startDate, endDate) {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return 0;
    }

    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  } catch (error) {
    console.error('Date difference calculation error:', error);
    return 0;
  }
}

export function isOverdue(dueDate) {
  if (!dueDate) return false;

  try {
    const due = new Date(dueDate);
    const now = new Date();

    if (isNaN(due.getTime())) {
      return false;
    }

    return due < now;
  } catch (error) {
    console.error('Overdue check error:', error);
    return false;
  }
}

export function getRelativeTime(dateString) {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    const now = new Date();

    if (isNaN(date.getTime())) {
      return '';
    }

    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  } catch (error) {
    console.error('Relative time error:', error);
    return '';
  }
}

export function formatDateForInput(dateString) {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return '';
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('Date input formatting error:', error);
    return '';
  }
}