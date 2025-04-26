// types.ts
interface Task {
    id: number;
    text: string;
    completed: boolean;
  }
  
  // constants.ts
  const DOM_IDS = {
    TASK_LIST: 'taskList',
    TASK_INPUT: 'taskInput',
    ADD_TASK_BUTTON: 'addTaskBtn',
  } as const;
  
  const CLASS_NAMES = {
    TASK_ITEM: 'task-item',
    COMPLETED: 'completed',
    COMPLETE_BUTTON: 'complete-btn',
    DELETE_BUTTON: 'delete-btn',
  } as const;
  
  // todo-list.ts
  class TodoList {
    private tasks: Task[] = [];
    private readonly taskList: HTMLUListElement;
    private readonly taskInput: HTMLInputElement;
    private readonly addTaskBtn: HTMLButtonElement;
  
    constructor() {
      this.taskList = this.getElement<HTMLUListElement>(DOM_IDS.TASK_LIST);
      this.taskInput = this.getElement<HTMLInputElement>(DOM_IDS.TASK_INPUT);
      this.addTaskBtn = this.getElement<HTMLButtonElement>(DOM_IDS.ADD_TASK_BUTTON);
  
      this.bindEvents();
    }
  
    private getElement<T extends HTMLElement>(id: string): T {
      const element = document.getElementById(id);
      if (!element) {
        throw new Error(`Element with ID "${id}" not found`);
      }
      return element as T;
    }
  
    private bindEvents(): void {
      this.addTaskBtn.addEventListener('click', () => this.addTask());
      this.taskInput.addEventListener('keypress', (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
          this.addTask();
        }
      });
    }
  
    private addTask(): void {
      const taskText = this.taskInput.value.trim();
      if (!taskText) {
        return;
      }
  
      const task: Task = {
        id: Date.now(),
        text: taskText,
        completed: false,
      };
  
      this.tasks = [...this.tasks, task];
      this.renderTask(task);
      this.taskInput.value = '';
    }
  
    private renderTask(task: Task): void {
      const li = this.createTaskElement(task);
      this.taskList.appendChild(li);
    }
  
    private createTaskElement(task: Task): HTMLLIElement {
      const li = document.createElement('li');
      li.classList.add(CLASS_NAMES.TASK_ITEM);
      if (task.completed) {
        li.classList.add(CLASS_NAMES.COMPLETED);
      }
  
      li.innerHTML = `
        <span>${this.escapeHtml(task.text)}</span>
        <div>
          <button class="${CLASS_NAMES.COMPLETE_BUTTON}">انجام شد</button>
          <button class="${CLASS_NAMES.DELETE_BUTTON}">حذف</button>
        </div>
      ;`
  
      const completeBtn = li.querySelector(`.${CLASS_NAMES.COMPLETE_BUTTON}`) as HTMLButtonElement;
      const deleteBtn = li.querySelector(`.${CLASS_NAMES.DELETE_BUTTON}`) as HTMLButtonElement;
  
      completeBtn.addEventListener('click', () => this.toggleTaskCompletion(task.id));
      deleteBtn.addEventListener('click', () => this.deleteTask(task.id, li));
  
      return li;
    }
  
    private escapeHtml(unsafe: string): string {
      return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }
  
    private toggleTaskCompletion(taskId: number): void {
      this.tasks = this.tasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      );
      this.refreshList();
    }
  
    private deleteTask(taskId: number, element: HTMLLIElement): void {
      this.tasks = this.tasks.filter(task => task.id !== taskId);
      element.remove();
    }
  
    private refreshList(): void {
      this.taskList.innerHTML = '';
      this.tasks.forEach(task => this.renderTask(task));
    }
  }
  
  // main.ts
  document.addEventListener('DOMContentLoaded', () => {
    try {
      new TodoList();
    } catch (error) {
      console.error('Failed to initialize TodoList:', error);
    }
  });