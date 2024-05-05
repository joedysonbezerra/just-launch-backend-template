# Users Serverless Project

![serverless](http://public.serverless.com/badges/v3.svg)
![Made using Typescript](https://badgen.net/badge/icon/typescript?icon=typescript&label&color=purple)

This repository contains the user serverless project.

## How to use this template

```bash
$ serverless create --template-url https://github.com/kernel-software-studio/template-serverless-project.git --path name_of_project
```

## 💻 Requirements

Before starting, make sure you've met the following requirements:

- You have installed both [`node@18.x` and `npm`](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm);
- You have installed [`aws-cli`](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html);
- You have the `Access Key ID` and `AWS Secret Access Key` from your user on AWS (if you don't have an access, please ask any other developer)

## 🚀 Installing

Configure the AWS access on your computer:

```bash
$ aws configure
```

```
AWS Access Key ID [None]: ${YOUR_ACCESS_KEY_ID}
AWS Secret Access Key [None]: ${YOUR_SECRET_ACCESS_KEY}
Default region name [None]: sa-east-1
Default output format [None]: ENTER
```

Install Serverless Framework globally:

```bash
$ npm install --location=global serverless
```

On your project folder, install dependencies:

```bash
$ npm install
```

## ☕ Usage

### Local development

You can invoke any function locally by using the following command:

```bash
serverless invoke local --function ${FUNCTION_NAME} --stage ${STAGE} -p src/interfaces/http/${FUNCTION_NAME}/events/request.json --aws-profile timetosend
```

### Deployment

```bash
$ serverless deploy --stage ${STAGE}
```

Serverless will verify lint rules automatically. After deploying, you should see output similar to:

```bash
Deploying serverless-api to stage staging (us-east-1)

✔ Service deployed to stack serverless-api-staging (152s)

endpoint: GET - https://api.serverless.com.br
functions:
  hello: aws-node-http-api-project-dev-hello (1.9 kB)
```

### Invocation

After successful deployment, you can call the created application using serverless CLI:

```bash
serverless invoke --function ${FUNCTION_NAME} --stage ${STAGE}
```

Or via HTTP:

```bash
curl https://api.serverless.com.br
```

### Testing

You can run unit tests with the following command:

```bash
npm run test
```

## 📫 Developing [WIP]
