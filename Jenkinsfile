pipeline {
  agent any
  environment {
    IMAGE_NAME = "bilal7191/flask-application"
    IMAGE_TAG = "latest"
    ENV_FILE_PATH = '.env'
    SNYK_TOKEN = credentials('SNYK_TOKEN')
    GIT_FOLDER= "helm-chart"
    GIT_TOKEN = credentials('GITHUB_TOKEN')
    POSTGRES_PASSWORD = credentials('kubernetes-github-jenkins-secret')
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
        timeout(time: 3, unit: 'MINUTES') {
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
    // sed -i "s|flaskApp:\n  image:.*|flaskApp:\n  image: ${IMAGE_NAME}|" values.yaml
    stage('GitOps Yaml'){
        steps{
            sh '''
                echo "$(pwd)"
                cd "${GIT_FOLDER}"
                echo " updating values.yaml for helm...."
                yq eval '.flaskApp.image = env(IMAGE_NAME)' -i values.yaml
                
                git config user.name "ahmedbilal-7191"
                git config user.email "ahmed.bilal7191@gmail.com"
                git remote set-url origin https://$GIT_TOKEN@github.com/ahmedbilal-7191/flask-application.git
                git add values.yaml
                echo "GIT_FOLDER=${GIT_FOLDER}"
                echo "IMAGE_NAME=${IMAGE_NAME}"
                echo "Checking git status:"
                git status
                echo "Checking if values.yaml is updated:"
                cat values.yaml             
                git commit -m "ci: update image to ${IMAGE_NAME}" || echo "No changes to commit"
                git push origin main
                cd ..                
            '''
        }
    } 
    stage('Apply ArgoCD Application') {
            steps {
                withCredentials([file(credentialsId: 'kubeconfig-id', variable: 'KUBECONFIG')]) {
                    sh '''
                        echo "applying secrets for database"
                        kubectl create secret generic db-secret \
                        --from-literal=POSTGRES_PASSWORD=${POSTGRES_PASSWORD} \
                        -n argocd
                        echo "Applying application to trigger ArgoCD"
                        kubectl apply -f argocd/application.yaml --validate=false
                    '''
                }
            }
        }   
    stage('Run ZAP Baseline Scan') {
      steps {
        script {
          // Make sure target is reachable from within the container
          // Run ZAP scan using Docker
          sh """
            mkdir -p zap-reports
            docker run --rm --network=host \
            -u 0:0 \
            -v $PWD/zap-reports:/zap/wrk \
                ghcr.io/zaproxy/zaproxy:stable \
                zap-baseline.py -t http://host.docker.internal:5000 -l FAIL -r zap-report.html
          """
        }
      }
    }

    // stage('Inject .env') {
    //   steps {
    //     withCredentials([file(credentialsId: 'docker-env-file', variable: 'MY_ENV')]) {
    //       sh 'cp "$MY_ENV" "${WORKSPACE}/${ENV_FILE_PATH}"'
    //     }
    //   }
    // }
    
    // stage('Deploy') {
    //   steps {
    //     sh 'docker-compose up -d'
    //   }
    // }
    
    // stage('Helm Deploy') {
    //   steps {
    //     withCredentials([file(credentialsId: 'kubeconfig-id', variable: 'KUBECONFIG')]) {
    //       sh '''
    //         helm version
    //         helm upgrade --install flask-deployment-v1 ./helm-chart 
    //         '''
    //     }
    //   }
    // }

  }
  
  post {
    always {
        publishHTML([
            allowMissing: false,
            alwaysLinkToLastBuild: true,
            keepAll: true,
            reportDir: 'zap-reports',
            reportFiles: 'zap-report.html',
            reportName: 'OWASP ZAP Security Report'
        ])
        }
    }
}
