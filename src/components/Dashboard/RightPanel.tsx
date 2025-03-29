import React, { useState, useRef } from "react";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { PlusCircle, Edit, Trash2, Check, X } from "lucide-react";
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
  monthlyTasks = [
    { id: "m1", label: "Complete project proposal", completed: false },
    { id: "m2", label: "Schedule team meeting", completed: true },
    { id: "m3", label: "Review quarterly goals", completed: false },
  ],
  dailyTasks = [
    { id: "d1", label: "Check emails", completed: true },
    { id: "d2", label: "Update dashboard", completed: false },
    { id: "d3", label: "Prepare presentation", completed: false },
  ],
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
  const deleteMonthlyTask = (id: string) => {
    setMonthlyTasksState(monthlyTasksState.filter((task) => task.id !== id));
  };

  const deleteDailyTask = (id: string) => {
    setDailyTasksState(dailyTasksState.filter((task) => task.id !== id));
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
  const renderTaskItem = (task: Task, isMonthly: boolean) => {
    const isEditing = editingTaskId === task.id;
    const toggleTask = isMonthly ? toggleMonthlyTask : toggleDailyTask;
    const deleteTask = isMonthly ? deleteMonthlyTask : deleteDailyTask;

    return (
      <li key={task.id} className="flex items-center gap-2 group">
        <Checkbox
          id={`${isMonthly ? "monthly" : "daily"}-${task.id}`}
          checked={task.completed}
          onCheckedChange={() => toggleTask(task.id)}
          className="border-border"
        />
        {isEditing ? (
          <div className="flex-1 flex items-center gap-2">
            <Input
              ref={editInputRef}
              value={editingTaskText}
              onChange={(e) => setEditingTaskText(e.target.value)}
              onKeyDown={handleEditKeyPress}
              className="flex-1 border-border h-8 py-1"
            />
            <Button
              size="icon"
              variant="ghost"
              onClick={saveEdit}
              className="h-7 w-7 p-0"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={cancelEdit}
              className="h-7 w-7 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <label
              htmlFor={`${isMonthly ? "monthly" : "daily"}-${task.id}`}
              className={cn(
                "flex-1 transition-colors",
                task.completed ? "line-through text-muted-foreground" : "",
              )}
            >
              {task.label || "(Empty)"}
            </label>
            <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => startEditing(task)}
                className="h-6 w-6 p-0"
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => deleteTask(task.id)}
                className="h-6 w-6 p-0 text-destructive hover:text-destructive"
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
    <div className="w-full h-full p-4 bg-background flex flex-col gap-6 overflow-auto">
      {/* Monthly To-Do Section */}
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold uppercase flex items-center">
          THINGS TO DO THIS MONTH
        </h2>
        <div className="border border-border p-3 rounded-md shadow-sm">
          <ul className="space-y-3 mb-3">
            {monthlyTasksState.map((task) => renderTaskItem(task, true))}
          </ul>
          <div className="flex gap-2 mt-4">
            <Input
              placeholder="Add a monthly task..."
              value={newMonthlyTask}
              onChange={(e) => setNewMonthlyTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addMonthlyTask()}
              className="flex-1 border-border"
            />
            <Button
              onClick={addMonthlyTask}
              variant="outline"
              className="border-border hover:bg-muted"
            >
              <PlusCircle className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
        </div>
      </div>

      {/* Daily To-Do Section */}
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">To Do List</h2>
        <div className="border border-border p-3 rounded-md shadow-sm">
          <ul className="space-y-3 mb-3">
            {dailyTasksState.map((task) => renderTaskItem(task, false))}
          </ul>
          <div className="flex gap-2 mt-4">
            <Input
              placeholder="Add a daily task..."
              value={newDailyTask}
              onChange={(e) => setNewDailyTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addDailyTask()}
              className="flex-1 border-border"
            />
            <Button
              onClick={addDailyTask}
              variant="outline"
              className="border-border hover:bg-muted"
            >
              <PlusCircle className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
