USE employeesdb;

INSERT INTO department (name)
VALUES ("Artist");
INSERT INTO department (name)
VALUES ("Producer");
INSERT INTO department (name)
VALUES ("Management");
INSERT INTO department (name)
VALUES ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("Lead Artist", 10000000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ("Lead Producer", 500000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ("Sound Engineer", 300000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ("Manager", 125000, 3);
INSERT INTO role (title, salary, department_id)
VALUES ("Legal Team Lead", 250000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Paper", "Boi", 1, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Darius", "Stanfield", 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Earn", "Marks", 3, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Steve", "E", 4, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Leen", "Hurst", 5, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Robbie", "Chater", 2, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Christian", "Clancy", 4, 7);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Dev", "Hynes", 1, 2);