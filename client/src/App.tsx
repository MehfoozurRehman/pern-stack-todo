import { useEffect, useState } from "react";

interface Todo {
  id: number;
  title: string;
  description: string;
  done: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/todo")
      .then((res) => res.json())
      .then((data) => {
        setTodos(data);
      });
  }, []);

  console.log(todos);

  return (
    <>
      <h1>Todo List</h1>
      <ul>
        {todos.map((todo) => (
          <Item key={todo.id} todo={todo} setTodos={setTodos} todos={todos} />
        ))}
      </ul>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const title = e.currentTarget.title.value;
          const description = e.currentTarget.description.value;
          fetch("http://localhost:3000/todo", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, description }),
          })
            .then((res) => res.json())
            .then((data) => {
              setTodos([...todos, data]);
            });
        }}
      >
        <input type="text" name="title" placeholder="Title" />
        <input type="text" name="description" placeholder="Description" />
        <button>Add</button>
      </form>
    </>
  );
}

export default App;

interface ItemProps {
  todo: Todo;
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
}

function Item({ todo, todos, setTodos }: ItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    fetch(`http://localhost:3000/todo/${todo.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description }),
    }).then(() => {
      setTodos(
        todos.map((t) => {
          if (t.id === todo.id) {
            return {
              ...t,
              title,
              description,
            };
          }
          return t;
        })
      );
    });
  };

  const handleDelete = () => {
    fetch(`http://localhost:3000/todo/${todo.id}`, {
      method: "DELETE",
    }).then(() => {
      setTodos(todos.filter((t) => t.id !== todo.id));
    });
  };

  const handleDone = (e: any) => {
    fetch(`http://localhost:3000/todo/${todo.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ done: e.target.checked }),
    }).then(() => {
      setTodos(
        todos.map((t) => {
          if (t.id === todo.id) {
            return {
              ...t,
              done: e.target.checked,
            };
          }
          return t;
        })
      );
    });
  };

  return (
    <li>
      <input type="checkbox" checked={todo.done} onChange={handleDone} />
      {isEditing ? (
        <>
          <input
            type="text"
            defaultValue={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            defaultValue={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button onClick={handleSave}>Save</button>
        </>
      ) : (
        <>
          <span>{todo.title}</span>
          <span>{todo.description}</span>
          <button onClick={handleEdit}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </>
      )}
    </li>
  );
}
