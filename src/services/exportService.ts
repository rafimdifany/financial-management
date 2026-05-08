import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { transactionRepository } from '../database/repositories/transactionRepository';
import { taskRepository } from '../database/repositories/taskRepository';
import { categoryRepository } from '../database/repositories/categoryRepository';
import { budgetRepository } from '../database/repositories/budgetRepository';
import { goalRepository } from '../database/repositories/goalRepository';
import { settingsRepository } from '../database/repositories/settingsRepository';
import { generateCSV } from '../utils/csvHelper';

export type ExportFormat = 'CSV' | 'JSON';

export const exportService = {
  async exportData(format: ExportFormat): Promise<void> {
    const transactions = await transactionRepository.getAllForExport();
    const tasks = await taskRepository.getAll('all');
    const categories = await categoryRepository.getAll();
    const customCategories = categories.filter(c => c.is_default === 0);
    const budgets = await budgetRepository.getAll();
    const goals = await goalRepository.getAll();
    const settings = await settingsRepository.getAll();

    const data = {
      transactions,
      tasks,
      categories: customCategories,
      budgets,
      goals,
      settings,
      exported_at: new Date().toISOString(),
    };

    const fileName = `finpro_export_${new Date().getTime()}.${format.toLowerCase()}`;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;

    let content = '';

    if (format === 'JSON') {
      content = JSON.stringify(data, null, 2);
    } else {
      // For CSV, the requirement says it includes all entities. 
      // Since standard CSV doesn't support multiple tables, we'll focus on transactions
      // but the requirement is specific. We'll generate a combined CSV with sections.
      // However, Excel/Google Sheets might not like it.
      // Another approach: just export transactions as the primary CSV content.
      // Let's try to follow the instruction: transactions, tasks, categories, budgets, goals, settings.
      
      content += '--- TRANSACTIONS ---\n';
      content += generateCSV(transactions) + '\n\n';
      
      content += '--- TASKS ---\n';
      content += generateCSV(tasks) + '\n\n';
      
      content += '--- CUSTOM CATEGORIES ---\n';
      content += generateCSV(customCategories) + '\n\n';
      
      content += '--- BUDGETS ---\n';
      content += generateCSV(budgets) + '\n\n';
      
      content += '--- GOALS ---\n';
      content += generateCSV(goals) + '\n\n';
      
      content += '--- SETTINGS ---\n';
      content += generateCSV([settings]) + '\n';
    }

    await FileSystem.writeAsStringAsync(filePath, content);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(filePath, {
        mimeType: format === 'JSON' ? 'application/json' : 'text/csv',
        dialogTitle: 'Export Data',
        UTI: format === 'JSON' ? 'public.json' : 'public.comma-separated-values-text',
      });
    }
  },
};
