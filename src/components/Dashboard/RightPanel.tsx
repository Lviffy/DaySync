import React, { useState, useRef } from "react";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { PlusCircle, Edit, Trash2, Check, X, ListTodo } from "lucide-react";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  label: string;
  completed: boolean;
}

interface RightPanelProps {
  monthlyTasks?: Task[];
  dailyTasks?: Task[];
}

const RightPanel = ({
  monthlyTasks = [],
  dailyTasks = [],
}: RightPanelProps) => {
  const [monthlyTasksState, setMonthlyTasksState] =
    useState<Task[]>(monthlyTasks);
  const [dailyTasksState, setDailyTasksState] = useState<Task[]>(dailyTasks);
  const [newMonthlyTask, setNewMonthlyTask] = useState("");
  const [newDailyTask, setNewDailyTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskText, setEditingTaskText] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);

  // Toggle task completion status
  const toggleMonthlyTask = (id: string) => {
    setMonthlyTasksState(
      monthlyTasksState.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const toggleDailyTask = (id: string) => {
    setDailyTasksState(
      dailyTasksState.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  // Add new tasks
  const addMonthlyTask = () => {
    if (newMonthlyTask.trim() === "") return;
    const newTask: Task = {
      id: `m${Date.now()}`,
      label: newMonthlyTask,
      completed: false,
    };
    setMonthlyTasksState([...monthlyTasksState, newTask]);
    setNewMonthlyTask("");
  };

  const addDailyTask = () => {
    if (newDailyTask.trim() === "") return;
    const newTask: Task = {
      id: `d${Date.now()}`,
      label: newDailyTask,
      completed: false,
    };
    setDailyTasksState([...dailyTasksState, newTask]);
    setNewDailyTask("");
  };

  // Delete tasks
  const deleteTask = (id: string) => {
    // Check if it's a monthly task (starts with 'm')
    if (id.startsWith("m")) {
      setMonthlyTasksState(monthlyTasksState.filter(task => task.id !== id));
    } else {
      setDailyTasksState(dailyTasksState.filter(task => task.id !== id));
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

  const saveEdit = () => {
    if (!editingTaskId) return;

    if (editingTaskId.startsWith("m")) {
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
  const renderTask = (task: Task, isMonthly: boolean) => {
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
              id={`${isMonthly ? "monthly" : "daily"}-${task.id}`}
              checked={task.completed}
              onCheckedChange={() =>
                isMonthly ? toggleMonthlyTask(task.id) : toggleDailyTask(task.id)
              }
              className="mr-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <label
              htmlFor={`${isMonthly ? "monthly" : "daily"}-${task.id}`}
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
                onClick={() => deleteTask(task.id)}
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
    <div className="w-full h-full p-3 md:p-5 bg-background/50 flex flex-col gap-4 md:gap-6 overflow-auto">
      {/* Monthly To-Do Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base md:text-lg font-medium text-foreground/90 flex items-center">
            <ListTodo className="h-4 w-4 mr-2 text-primary" />Monthly Tasks
          </h2>
          <div className="flex items-center gap-1">
            <Input
              value={newMonthlyTask}
              onChange={(e) => setNewMonthlyTask(e.target.value)}
              placeholder="Add task..."
              className="h-8 w-[140px] md:w-[200px] text-sm border-border/40"
              onKeyDown={(e) => e.key === "Enter" && addMonthlyTask()}
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={addMonthlyTask}
              disabled={!newMonthlyTask}
              className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <ul className="bg-background/80 rounded-md shadow-sm border border-border/30 p-1.5 min-h-[100px]">
          {monthlyTasksState.length > 0 ? (
            monthlyTasksState.map((task) => renderTask(task, true))
          ) : (
            <li className="py-6 text-center text-muted-foreground text-sm italic">
              No monthly tasks yet
            </li>
          )}
        </ul>
      </div>

      {/* Daily To-Do Section */}
      <div className="flex flex-col gap-3">
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
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={addDailyTask}
              disabled={!newDailyTask}
              className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <ul className="bg-background/80 rounded-md shadow-sm border border-border/30 p-1.5 min-h-[100px]">
          {dailyTasksState.length > 0 ? (
            dailyTasksState.map((task) => renderTask(task, false))
          ) : (
            <li className="py-6 text-center text-muted-foreground text-sm italic">
              No daily tasks yet
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default RightPanel;
