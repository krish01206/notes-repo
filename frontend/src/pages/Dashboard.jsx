import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api.js";

function Dashboard() {
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
    }

    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await API.get("/notes", {
        headers: {
          Authorization: token,
        },
      });

      setNotes(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/notes", formData, {
        headers: {
          Authorization: token,
        },
      });

      setFormData({
        title: "",
        content: "",
      });

      fetchNotes();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteNote = async (id) => {
    try {
      await API.delete(`/notes/${id}`, {
        headers: {
          Authorization: token,
        },
      });

      fetchNotes();
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");

    navigate("/");
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>ThinkBoard</h1>

        <button onClick={logout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="title"
          placeholder="Note Title"
          value={formData.title}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <textarea
          name="content"
          placeholder="Write your note..."
          value={formData.content}
          onChange={handleChange}
          required
          style={styles.textarea}
        />

        <button type="submit" style={styles.button}>
          Add Note
        </button>
      </form>

      <div style={styles.notesContainer}>
        {notes.map((note) => (
          <div key={note._id} style={styles.card}>
            <h3>{note.title}</h3>

            <p>{note.content}</p>

            <button
              onClick={() => deleteNote(note._id)}
              style={styles.deleteBtn}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logoutBtn: {
    padding: "10px",
    cursor: "pointer",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "20px",
  },

  input: {
    padding: "10px",
  },

  textarea: {
    padding: "10px",
    height: "100px",
  },

  button: {
    padding: "10px",
    cursor: "pointer",
  },

  notesContainer: {
    marginTop: "30px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },

  card: {
    border: "1px solid #ccc",
    padding: "15px",
    borderRadius: "10px",
  },

  deleteBtn: {
    marginTop: "10px",
    padding: "8px",
    cursor: "pointer",
    backgroundColor: "red",
    color: "white",
    border: "none",
  },
};

export default Dashboard;