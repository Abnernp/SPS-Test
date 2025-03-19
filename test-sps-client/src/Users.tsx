/**
 * Função para exibir e gerenciar usuários.
 * 
 * Esta função permite visualizar a lista de usuários cadastrados, adicionar novos usuários, editar dados de usuários existentes e excluir usuários.
 * 
 * O processo de criação e edição de usuários verifica se o e-mail já está cadastrado e exige a senha atual para atualização. 
 * Ao excluir, a confirmação é solicitada ao usuário.
 * 
 * A aplicação utiliza axios para fazer as requisições à API e toast para exibir mensagens de sucesso ou erro.
 */

import React, { useState, useEffect, FormEvent, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface User {
  name: string;
  email: string;
  type: string;
  password: string;
}

interface UsersProps {
  token: string;
}

const Users: React.FC<UsersProps> = ({ token }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [currentPassword, setCurrentPassword] = useState<string>(""); 
  const [tab, setTab] = useState<"list" | "add" | "edit">("list");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null); 
  const formRef = useRef<HTMLDivElement>(null);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5001/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!password.trim()) {
      toast.error("A senha é obrigatória!");
      return;
    }

    if (users.some((user) => user.email === email)) {
      toast.error("Este e-mail já está cadastrado!");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5001/users",
        { name, email, type, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Usuário cadastrado com sucesso!");
      handleClose();
      fetchUsers();
    } catch (err) {
      console.error("Erro ao cadastrar usuário:", err);
      toast.error("Erro ao cadastrar usuário. Tente novamente.");
    }
  };

  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    
    if (currentPassword !== editingUser.password) {
      toast.error("A senha atual está incorreta!");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5001/users/${editingUser.email}`,
        { name, email, type, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Usuário atualizado com sucesso!");
      handleClose();
      fetchUsers();
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err);
      toast.error("Erro ao atualizar usuário.");
    }
  };

  const handleDelete = async () => {
    if (userToDelete) {
      try {
        await axios.delete(`http://localhost:5001/users/${userToDelete.email}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Usuário excluído com sucesso!");
        setUserToDelete(null); 
        fetchUsers();
      } catch (err) {
        console.error("Erro ao excluir usuário:", err);
        toast.error("Erro ao excluir usuário.");
      }
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setType(user.type);
    setPassword("");
    setCurrentPassword(""); 
    setTab("edit");
  };

  const handleClose = () => {
    setTab("list");
    setName("");
    setEmail("");
    setType("");
    setPassword("");
    setCurrentPassword("");
    setEditingUser(null);
  };

  const openDeleteDialog = (user: User) => {
    setUserToDelete(user);
  };

  const closeDeleteDialog = () => {
    setUserToDelete(null); 
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    if (tab === "add" || tab === "edit") {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [tab]);

  return (
    <div className="bg-gray-200 h-full min-h-screen flex flex-col">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center justify-center mt-12 bg-white p-4 w-full shadow-md">
          <img src="/sps.png" alt="SPS Logo" className="w-12 h-12 mr-3" />
          <p className="text-3xl">SPS TEST</p>
        </div>
        <div className="justify-between w-full max-w-3xl flex items-center mb-2">
          <h3 className="text-3xl font-bold mt-8">Usuários Cadastrados</h3>
          <button
            onClick={() => setTab("add")}
            className="bg-blue-700 text-white px-3 py-2 mt-8  rounded-lg hover:bg-blue-600"
          >
            Cadastrar Usuário
          </button>
        </div>
        <ul className="w-full max-w-3xl mb-8">
          {users.map((user) => (
            <li key={user.email} className="flex justify-between items-center p-2 border-b border-gray-300">
              <span>
                {user.name} ({user.email}) {user.type}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(user)}
                  className="bg-orange-600 text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => openDeleteDialog(user)} 
                  className="bg-red-700 rounded-lg text-white px-3 py-1 hover:bg-red-500"
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>

        {userToDelete && (
          <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
            <div className="bg-white p-4 rounded-lg shadow-xl">
              <p className="text-lg font-bold mb-2">
                Deseja realmente excluir o usuário ?
              </p>
              <p className="flex justify-center mb-6">{userToDelete.email}</p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={closeDeleteDialog}
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Sim
                </button>
              </div>
            </div>
          </div>
        )}

        {(tab === "add" || tab === "edit") && (
          <div ref={formRef} className="w-full max-w-xl p-4 border rounded-lg bg-white shadow-2xl mb-12">
            <h3 className="text-lg font-bold mb-2">
              {tab === "add" ? "Cadastrar Usuário" : "Editar Usuário"}
            </h3>
            <form onSubmit={tab === "add" ? handleSubmit : handleEditSubmit} className="flex flex-col gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome"
                className="border p-2 rounded shadow-md"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail"
                className="border p-2 rounded shadow-md"
              />
              <input
                type="text"
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="Tipo"
                className="border p-2 rounded shadow-md"
              />
              {tab === "edit" && (
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Senha Atual"
                  className="border p-2 rounded shadow-md"
                />
              )}
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={tab === "add" ? "Senha" : "Nova Senha"}
                className="border p-2 rounded shadow-md"
              />
              <div className="flex justify-center mt-2 gap-6">
                <button
                  type="button"
                  onClick={handleClose}
                  className="bg-gray-500 text-white px-4 py-1 rounded-lg hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-1 rounded-lg hover:bg-green-700"
                >
                  {tab === "add" ? "Cadastrar" : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
