import coonection from "../../main.js";

coonection.sync().then(() => {
  const user = coonection.define('user', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    sobrenome: {
      type: DataTypes.STRING(100),
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    senha: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    dataNascimento: {
      type: DataTypes.DATEONLY,
    },
    telefone: {
      type: DataTypes.STRING(20),
    },
    sexo: {
      type: DataTypes.STRING(10),
    },
    dataCriacao: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    dataAtualizacao: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'user',
    timestamps: false,
  });
  return user;
})

module.exports = () => User;


// Definindo os modelos
export const Student = sequelize.define('Student', {
    name: DataTypes.STRING,
  });
export const Course = sequelize.define('Course', {
    title: DataTypes.STRING,
  });
  
  // Definindo a associação
  Student.belongsToMany(Course, { through: 'StudentCourse' });
  Course.belongsToMany(Student, { through: 'StudentCourse' });
  