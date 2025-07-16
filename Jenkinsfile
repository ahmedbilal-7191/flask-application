pipeline {
  agent any

  environment {
    IMAGE_NAME = "bilal7191/flask-application"
    IMAGE_TAG = "latest"
    ENV_FILE_PATH = '.env'
    SNYK_TOKEN = credentials('SNYK_TOKEN')
  }

  stages {
    stage('Checkout Code') {
      steps {
        git branch: 'main', url: 'https://github.com/ahmedbilal-7191/flask-application.git'
      }
    }
    
    stage('SonarQube Scan') {
      steps {
        withSonarQubeEnv('MySonar') {
          // If you have a sonar-project.properties in repo
          sh "${tool 'SonarScanner'}/bin/sonar-scanner"
        }
      }
    }
    
    stage('Quality Gate') {
      steps {
        timeout(time: 4, unit: 'MINUTES') {
          // This waits for the quality gate result
          waitForQualityGate abortPipeline: true
        }
      }
    }
    
    stage('Snyk Scan - Python Packages') {
      steps {
        sh '''
          python3 -m venv venv
          . venv/bin/activate
          pip install --upgrade pip
          pip install -r requirements.txt
          snyk test --file=requirements.txt --package-manager=pip
        '''
      }
    }

    stage('Build Docker Image') {
      steps {
        script {
          sh "docker build -t $IMAGE_NAME:$IMAGE_TAG ."
        }
      }
    }

    stage('Push to Docker Hub') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh '''
            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
            docker push $IMAGE_NAME:$IMAGE_TAG
          '''
        }
      }
    }

    stage('Inject .env') {
      steps {
        withCredentials([file(credentialsId: 'docker-env-file', variable: 'MY_ENV')]) {
          sh 'cp "$MY_ENV" "${WORKSPACE}/${ENV_FILE_PATH}"'
        }
      }
    }

    stage('Deploy') {
      steps {
        sh 'docker-compose up -d'
      }
    }
  }
}
