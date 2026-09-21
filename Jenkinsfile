pipeline {
    agent {
        kubernetes {
            yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: docker
    image: 172.20.147.120:8081/library/docker:24.0
    command: ['cat']
    tty: true
    volumeMounts:
    - name: docker-sock
      mountPath: /var/run/docker.sock
  volumes:
  - name: docker-sock
    hostPath:
      path: /var/run/docker.sock
"""
        }
    }
    parameters {
        string(name: 'IMAGE_TAG', defaultValue: '1.0.0', description: 'image version tag')
    }
    environment {
        REGISTRY = '172.20.147.120:8081'
        HARBOR_NAMESPACE = 'wolfcode'
        APP_NAME = 'turing-site'
        DEPLOY_NAMESPACE = 'devops-web'
        IMAGE_NAME = "${REGISTRY}/${HARBOR_NAMESPACE}/${APP_NAME}:${IMAGE_TAG}"
    }
    stages {
        stage('Checkout') {
            steps { checkout scm }
        }
        stage('Build Image') {
            steps {
                container('docker') {
                    sh "docker build -t ${IMAGE_NAME} ."
                }
            }
        }
        stage('Push Image') {
            steps {
                container('docker') {
                    withCredentials([usernamePassword(credentialsId: 'harbor-user-pass',
                                                     passwordVariable: 'HARBOR_PWD',
                                                     usernameVariable: 'HARBOR_USER')]) {
                        sh """
                            echo \${HARBOR_PWD} | docker login ${REGISTRY} -u \${HARBOR_USER} --password-stdin
                            docker push ${IMAGE_NAME}
                            docker logout ${REGISTRY}
                        """
                    }
                }
            }
        }
        stage('Deploy To K8s') {
            steps {
                withKubeConfig(credentialsId: 'kubeconfig') {
                    kubernetesApply(file: 'deploy.yaml', namespace: 'devops-web')
                }
            }
        }
    }
    post {
        success { echo "SUCCESS: ${IMAGE_NAME}" }
        failure { echo "FAILED: check logs" }
    }
}
