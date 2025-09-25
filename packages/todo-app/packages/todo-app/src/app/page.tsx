'use client'

import { useState } from 'react'
import { PlusIcon, TrashIcon, CheckIcon, PencilIcon } from '@heroicons/react/24/outline'

interface Todo {
  id: number
  text: string
  completed: boolean
}

type FilterType = 'all' | 'active' | 'completed'

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [inputValue, setInputValue] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingText, setEditingText] = useState('')

  const addTodo = () => {
    if (inputValue.trim() !== '') {
      setTodos([...todos, { id: Date.now(), text: inputValue.trim(), completed: false }])
      setInputValue('')
    }
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const startEditing = (id: number, text: string) => {
    setEditingId(id)
    setEditingText(text)
  }

  const saveEdit = () => {
    if (editingText.trim() !== '') {
      setTodos(todos.map(todo => 
        todo.id === editingId ? { ...todo, text: editingText.trim() } : todo
      ))
    }
    setEditingId(null)
    setEditingText('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingText('')
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const activeTodosCount = todos.filter(todo => !todo.completed).length
  const completedTodosCount = todos.filter(todo => todo.completed).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            ✨ Beautiful Todos
          </h1>
          <p className="text-gray-600 text-lg">Stay organized and productive</p>
        </div>

        {/* Add Todo Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 hover-lift animate-slide-in">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none input-focus placeholder-gray-400 text-lg"
              placeholder="What needs to be done?"
            />
            <button
              onClick={addTodo}
              className="btn-primary text-white px-6 py-3 rounded-xl flex items-center gap-2 font-medium shadow-lg"
            >
              <PlusIcon className="w-5 h-5" />
              Add
            </button>
          </div>
        </div>

        {/* Stats */}
        {todos.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 hover-lift animate-fade-in">
            <div className="flex justify-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500 animate-pulse-gentle">{todos.length}</div>
                <div className="text-gray-600 font-medium">Total</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500 animate-pulse-gentle">{activeTodosCount}</div>
                <div className="text-gray-600 font-medium">Active</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500 animate-pulse-gentle">{completedTodosCount}</div>
                <div className="text-gray-600 font-medium">Done</div>
              </div>
            </div>
          </div>
        )}

        {/* Filter Buttons */}
        {todos.length > 0 && (
          <div className="flex justify-center gap-3 mb-6 animate-fade-in">
            {(['all', 'active', 'completed'] as FilterType[]).map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 hover-lift ${
                  filter === filterType
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50 shadow-md'
                }`}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </button>
            ))}
          </div>
        )}

        {/* Todo List */}
        <div className="space-y-4">
          {filteredTodos.map((todo, index) => (
            <div
              key={todo.id}
              className={`todo-item bg-white rounded-xl shadow-lg p-5 hover-lift ${
                todo.completed ? 'opacity-75 todo-completed' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Checkbox */}
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                    todo.completed
                      ? 'bg-green-500 border-green-500 text-white shadow-lg'
                      : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
                  }`}
                >
                  {todo.completed && <CheckIcon className="w-4 h-4" />}
                </button>

                {/* Todo Text */}
                <div className="flex-1">
                  {editingId === todo.id ? (
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') saveEdit()
                        if (e.key === 'Escape') cancelEdit()
                      }}
                      onBlur={saveEdit}
                      className="w-full px-3 py-2 border-2 border-purple-300 rounded-lg focus:outline-none focus:border-purple-500 text-lg input-focus"
                      autoFocus
                    />
                  ) : (
                    <span
                      className={`text-lg font-medium cursor-pointer ${
                        todo.completed
                          ? 'line-through text-gray-500'
                          : 'text-gray-800 hover:text-purple-600'
                      }`}
                      onClick={() => !todo.completed && startEditing(todo.id, todo.text)}
                    >
                      {todo.text}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {editingId === todo.id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={saveEdit}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 hover:scale-110"
                      >
                        <CheckIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200 hover:scale-110"
                      >
                        <span className="text-lg">✕</span>
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => startEditing(todo.id, todo.text)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110"
                        title="Edit todo"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
                        title="Delete todo"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {todos.length === 0 && (
          <div className="text-center py-16 animate-bounce-in">
            <div className="text-8xl mb-6">📝</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">No todos yet</h3>
            <p className="text-gray-500 text-lg">Add your first todo above to get started!</p>
          </div>
        )}

        {/* Filtered Empty State */}
        {todos.length > 0 && filteredTodos.length === 0 && (
          <div className="text-center py-16 animate-bounce-in">
            <div className="text-8xl mb-6">
              {filter === 'active' ? '🎯' : '✅'}
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">
              No {filter} todos
            </h3>
            <p className="text-gray-500 text-lg">
              {filter === 'active' 
                ? 'All your todos are completed! Great job! 🎉'
                : 'No completed todos yet. Keep working! 💪'
              }
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-gray-400 animate-fade-in">
          <p className="text-sm">Click on a todo to edit it • Press Enter to save • Escape to cancel</p>
        </div>
      </div>
    </div>
  )
}
