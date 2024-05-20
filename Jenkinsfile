pipeline {
  agent any
  stages {
      stage('setup') {
        steps {
            browserstack(credentialsId: 'e35f46d7-fd1f-49ab-b18d-e05dabdfcb15') {
                // add commands to run test
                // Following are some of the example commands -----
                sh 'npm install'
                sh 'npx webdriver-manager start'
                sh 'npm run test'
                //sh 'browserstack-node-sdk jest src/sample.test.js'
            }
             // Enable reporting in Jenkins
             //browserStackReportPublisher 'automate'
        }
      }
    }
  }
