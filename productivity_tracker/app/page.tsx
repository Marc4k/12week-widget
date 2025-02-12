'use client';

import { useState } from 'react';
import { format, startOfWeek, addDays } from 'date-fns';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  isRecurring: boolean;
}

export default function WeeklyPlanner() {
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [tasks, setTasks] = useState<{ [key: string]: Task[] }>({});

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = addDays(startOfWeek(selectedWeek), i);
    return format(day, 'EEEE, MMM d');
  });

  const addTask = (day: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: '',
      completed: false,
      isRecurring: false,
    };
    setTasks(prev => ({
      ...prev,
      [day]: [...(prev[day] || []), newTask],
    }));
  };

  const toggleTaskComplete = (day: string, taskId: string) => {
    setTasks(prev => ({
      ...prev,
      [day]: prev[day].map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ),
    }));
  };

  const toggleRecurring = (day: string, taskId: string) => {
    setTasks(prev => ({
      ...prev,
      [day]: prev[day].map(task =>
        task.id === taskId ? { ...task, isRecurring: !task.isRecurring } : task
      ),
    }));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Weekly Planner 📅
        </h1>

        {/* Week Selection */}
        <div className="mb-8 flex justify-center">
          <input
            type="week"
            onChange={(e) => setSelectedWeek(new Date(e.target.value))}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Weekly Grid */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {weekDays.map((day) => (
            <div
              key={day}
              className="bg-gray-800 rounded-lg p-4 shadow-lg"
            >
              <h2 className="text-lg font-semibold mb-4 flex items-center justify-between">
                {format(new Date(day), 'EEE')}
                <span className="text-sm text-gray-400">
                  {format(new Date(day), 'MMM d')}
                </span>
              </h2>

              {/* Tasks */}
              <div className="space-y-3">
                {tasks[day]?.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-2 bg-gray-700 rounded-lg p-2"
                  >
                    <button
                      onClick={() => toggleTaskComplete(day, task.id)}
                      className={`w-5 h-5 rounded border ${task.completed
                          ? 'bg-green-500 border-green-600'
                          : 'border-gray-600'
                        }`}
                    >
                      {task.completed && '✓'}
                    </button>
                    <input
                      type="text"
                      value={task.title}
                      onChange={(e) =>
                        setTasks(prev => ({
                          ...prev,
                          [day]: prev[day].map(t =>
                            t.id === task.id ? { ...t, title: e.target.value } : t
                          ),
                        }))
                      }
                      className="flex-1 bg-transparent border-none focus:outline-none"
                      placeholder="Enter task..."
                    />
                    <button
                      onClick={() => toggleRecurring(day, task.id)}
                      className={`text-lg ${task.isRecurring ? 'text-blue-400' : 'text-gray-500'
                        }`}
                      title="Toggle recurring task"
                    >
                      🔄
                    </button>
                  </div>
                ))}

                <button
                  onClick={() => addTask(day)}
                  className="w-full py-2 text-gray-400 hover:text-gray-200 transition-colors"
                >
                  + Add Task
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
