const swaggerAutogen = require("swagger-autogen")({laguage:'ko'});

const doc = {
  info: {
    title: "My API",
    description: "Description",
  },
  host: "localhost:3000",
  schemes: ["http"],
  tags: [
    {
      name: 'user',
      description: '회원관리 API',
      summary: '회원관리 API'
    },
    {
      name: 'article',
      description: '게시글관련 API',
      summary: '게시글관련 API'
    },
    {
      name: 'comment',
      description: '댓글관련 API',
      summary: '댓글관련 API'
    }
  ]
};

const outputFile = "./swagger-output.json";
const endpointsFiles = [
  "./app.js"
];

swaggerAutogen(outputFile, endpointsFiles, doc);