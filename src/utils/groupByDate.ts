import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { TransactionWithCategory } from '../types/transaction';

export interface TransactionGroup {
  title: string;
  data: TransactionWithCategory[];
}

export function groupByDate(transactions: TransactionWithCategory[]): TransactionGroup[] {
  const groups: { [key: string]: TransactionWithCategory[] } = {};
  
  transactions.forEach(tx => {
    const date = parseISO(tx.date);
    let title = format(date, 'MMMM d, yyyy');
    
    if (isToday(date)) title = 'Today';
    else if (isYesterday(date)) title = 'Yesterday';
    
    if (!groups[title]) groups[title] = [];
    groups[title].push(tx);
  });
  
  return Object.keys(groups).map(title => ({
    title,
    data: groups[title]
  }));
}
