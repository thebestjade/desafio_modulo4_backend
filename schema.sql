create database final_project_cubos;

create table users (
  id serial primary key,
  name text not null,
  email text not null unique,
  password text not null,
  cpf text unique,
  phone text
);

create table clients (
  id serial primary key,
  user_id integer not null references users (id),
  name text not null,
  email text not null unique,
  cpf text not null unique,
  phone text not null unique,
  cep text,
  public_place text,
  complement text,
  district text,
  city text,
  uf text
);