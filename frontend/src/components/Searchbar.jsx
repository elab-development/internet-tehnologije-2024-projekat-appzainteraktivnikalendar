// src/components/SearchBar.jsx
import React from "react";
import { Form, Button } from "react-bootstrap";
import "../styles/Searchbar.css";

const Searchbar = ({ value, onChange, onClear, placeholder }) => {
  return (
    <Form.Group className="mb-3 position-relative search-bar-group">
      <Form.Control
        type="text"
        placeholder={placeholder || "Pretraga..."}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <Button
          variant="link"
          className="clear-btn"
          onClick={onClear}
        >
          &times;
        </Button>
      )}
    </Form.Group>
  );
};

export default Searchbar;
