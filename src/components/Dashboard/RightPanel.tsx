import React, { useState, useRef, useEffect } from "react";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { PlusCircle, Edit, Trash2, Check, X, ListTodo } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "../../contexts/UserContext.jsx";
import { taskService } from "../../services/taskService";

interface Task {
  id: string;
  label: string;
  completed: boolean;
  task_type?: 'monthly' | 'daily';
  user_id?: string;
}

interface RightPanelProps {
  monthlyTasks?: Task[];
  dailyTasks?: Task[];
}

const RightPanel = () => {
  const [monthlyTasksState, setMonthlyTasksState] = useState<Task[]>([]);
  const [dailyTasksState, setDailyTasksState] = useState<Task[]>([]);
  const [newMonthlyTask, setNewMonthlyTask] = useState("");
  const [newDailyTask, setNewDailyTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskText, setEditingTaskText] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const editInputRef = useRef<HTMLInputElement>(null);
  const { user } = useUser();

  // Fetch tasks when component mounts or user changes
  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  // Fetch tasks from Supabase
  const fetchTasks = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const monthlyTasks = await taskService.fetchTasks(user.id, 'monthly');
      const dailyTasks = await taskService.fetchTasks(user.id, 'daily');
      
      setMonthlyTasksState(monthlyTasks);
      setDailyTasksState(dailyTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      showToast('Failed to load tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Show toast notification
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  // Toggle task completion status
  const toggleMonthlyTask = async (id: string, completed: boolean) => {
    if (!user) return;

    try {
      await taskService.toggleTaskCompletion(id, completed);
      
      setMonthlyTasksState(
        monthlyTasksState.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task,
        ),
      );
    } catch (error) {
      console.error("Error toggling task:", error);
      showToast('Failed to update task', 'error');
    }
  };

  const toggleDailyTask = async (id: string, completed: boolean) => {
    if (!user) return;

    try {
      await taskService.toggleTaskCompletion(id, completed);
      
      setDailyTasksState(
        dailyTasksState.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task,
        ),
      );
    } catch (error) {
      console.error("Error toggling task:", error);
      showToast('Failed to update task', 'error');
    }
  };

  // Add new tasks
  const addMonthlyTask = async () => {
    if (!user || newMonthlyTask.trim() === "") return;
    
    try {
      const taskData = {
        label: newMonthlyTask,
        completed: false
      };
      
      const newTask = await taskService.addTask(taskData, user.id, 'monthly');
      setMonthlyTasksState([newTask, ...monthlyTasksState]);
      setNewMonthlyTask("");
      showToast('Monthly task added');
    } catch (error) {
      console.error("Error adding task:", error);
      showToast('Failed to add task', 'error');
    }
  };

  const addDailyTask = async () => {
    if (!user || newDailyTask.trim() === "") return;
    
    try {
      const taskData = {
        label: newDailyTask,
        completed: false
      };
      
      const newTask = await taskService.addTask(taskData, user.id, 'daily');
      setDailyTasksState([newTask, ...dailyTasksState]);
      setNewDailyTask("");
      showToast('Daily task added');
    } catch (error) {
      console.error("Error adding task:", error);
      showToast('Failed to add task', 'error');
    }
  };

  // Delete tasks
  const deleteTask = async (id: string, taskType: 'monthly' | 'daily') => {
    if (!user) return;
    
    try {
      await taskService.deleteTask(id);
      
      if (taskType === 'monthly') {
        setMonthlyTasksState(monthlyTasksState.filter(task => task.id !== id));
      } else {
        setDailyTasksState(dailyTasksState.filter(task => task.id !== id));
      }
      showToast('Task deleted');
    } catch (error) {
      console.error("Error deleting task:", error);
      showToast('Failed to delete task', 'error');
    }
  };

  // Edit tasks
  const startEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingTaskText(task.label);
    setTimeout(() => {
      editInputRef.current?.focus();
    }, 10);
  };

  const saveEdit = async () => {
    if (!user || !editingTaskId) return;

    try {
      await taskService.updateTask(editingTaskId, { label: editingTaskText });
      
      // Determine which task list to update
      const taskType = monthlyTasksState.some(t => t.id === editingTaskId) ? 'monthly' : 'daily';
      
      if (taskType === 'monthly') {
        setMonthlyTasksState(
          monthlyTasksState.map((task) =>
            task.id === editingTaskId
              ? { ...task, label: editingTaskText }
              : task,
          ),
        );
      } else {
        setDailyTasksState(
          dailyTasksState.map((task) =>
            task.id === editingTaskId
              ? { ...task, label: editingTaskText }
              : task,
          ),
        );
      }
      
      setEditingTaskId(null);
      setEditingTaskText("");
      showToast('Task updated');
    } catch (error) {
      console.error("Error updating task:", error);
      showToast('Failed to update task', 'error');
    }
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditingTaskText("");
  };

  // Handle key press in edit mode
  const handleEditKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveEdit();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  // Render task item
  const renderTask = (task: Task, taskType: 'monthly' | 'daily') => {
    const isMonthly = taskType === 'monthly';
    
    return (
      <li
        key={task.id}
        className={cn(
          "flex items-center py-1.5 px-2 rounded-md transition-all duration-200 group hover:bg-accent/50",
          editingTaskId === task.id && "bg-accent/50",
        )}
      >
        {editingTaskId === task.id ? (
          <div className="flex items-center w-full gap-1">
            <Input
              value={editingTaskText}
              onChange={(e) => setEditingTaskText(e.target.value)}
              ref={editInputRef}
              onKeyDown={handleEditKeyPress}
              className="flex-1 border-border h-8 py-1 text-sm"
            />
            <Button
              size="icon"
              variant="ghost"
              onClick={saveEdit}
              className="h-7 w-7 p-0 hover:bg-primary/10 hover:text-primary"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={cancelEdit}
              className="h-7 w-7 p-0 hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <Checkbox
              id={`${taskType}-${task.id}`}
              checked={task.completed}
              onCheckedChange={() =>
                isMonthly 
                  ? toggleMonthlyTask(task.id, task.completed) 
                  : toggleDailyTask(task.id, task.completed)
              }
              className="mr-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <label
              htmlFor={`${taskType}-${task.id}`}
              className={cn(
                "flex-1 transition-colors cursor-pointer text-sm",
                task.completed ? "line-through text-muted-foreground opacity-70" : "",
              )}
            >
              {task.label || "(Empty)"}
            </label>
            <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => startEditing(task)}
                className="h-6 w-6 p-0 hover:bg-primary/10 hover:text-primary"
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => deleteTask(task.id, taskType)}
                className="h-6 w-6 p-0 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </>
        )}
      </li>
    );
  };

  return (
    <div className="w-full h-full p-0 md:p-2 flex flex-col gap-4 md:gap-6 overflow-auto">
      {/* Toast notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-md ${
          toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`}>
          {toast.message}
        </div>
      )}
      
      {/* Monthly To-Do Section */}
      <div className="flex flex-col gap-3 p-4 bg-background/80 rounded-lg shadow-sm border border-border/30 transition-all duration-200 hover:shadow-md">
        <div className="flex items-center justify-between">
          <h2 className="text-base md:text-lg font-medium text-foreground/90 flex items-center">
            <ListTodo className="h-4 w-4 mr-2 text-primary" />Monthly Goal
          </h2>
          <div className="flex items-center gap-1">
            <Input
              value={newMonthlyTask}
              onChange={(e) => setNewMonthlyTask(e.target.value)}
              placeholder="Add task..."
              className="h-8 w-[140px] md:w-[200px] text-sm border-border/40"
              onKeyDown={(e) => e.key === "Enter" && addMonthlyTask()}
              disabled={!user}
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={addMonthlyTask}
              disabled={!newMonthlyTask || !user}
              className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <ul className="bg-background/80 rounded-md shadow-sm border border-border/30 p-1.5 min-h-[100px]">
          {loading ? (
            <li className="py-6 text-center text-muted-foreground text-sm">
              Loading tasks...
            </li>
          ) : monthlyTasksState.length > 0 ? (
            monthlyTasksState.map((task) => renderTask(task, 'monthly'))
          ) : (
            <li className="py-6 text-center text-muted-foreground text-sm italic">
              {user ? "No monthly tasks yet" : "Sign in to add tasks"}
            </li>
          )}
        </ul>
      </div>

      {/* Daily To-Do Section */}
      <div className="flex flex-col gap-3 p-4 bg-background/80 rounded-lg shadow-sm border border-border/30 transition-all duration-200 hover:shadow-md">
        <div className="flex items-center justify-between">
          <h2 className="text-base md:text-lg font-medium text-foreground/90 flex items-center">
            <ListTodo className="h-4 w-4 mr-2 text-primary" />Daily Tasks
          </h2>
          <div className="flex items-center gap-1">
            <Input
              value={newDailyTask}
              onChange={(e) => setNewDailyTask(e.target.value)}
              placeholder="Add task..."
              className="h-8 w-[140px] md:w-[200px] text-sm border-border/40"
              onKeyDown={(e) => e.key === "Enter" && addDailyTask()}
              disabled={!user}
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={addDailyTask}
              disabled={!newDailyTask || !user}
              className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <ul className="bg-background/80 rounded-md shadow-sm border border-border/30 p-1.5 min-h-[100px]">
          {loading ? (
            <li className="py-6 text-center text-muted-foreground text-sm">
              Loading tasks...
            </li>
          ) : dailyTasksState.length > 0 ? (
            dailyTasksState.map((task) => renderTask(task, 'daily'))
          ) : (
            <li className="py-6 text-center text-muted-foreground text-sm italic">
              {user ? "No daily tasks yet" : "Sign in to add tasks"}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default RightPanel;
