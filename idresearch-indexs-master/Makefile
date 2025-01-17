dev:
	go run ./cmd/... 
cover:
	go test --cover -coverpkg=./...  ./tests/... -coverprofile=cover.out
sonar:
	sonar-scanner -Dsonar.projectKey=idresearch -Dsonar.sources=. -Dsonar.host.url=http://139.162.15.48:8084 -Dsonar.login=sqp_ef174f925d1f457600d10f5a003a6b279e173d55
