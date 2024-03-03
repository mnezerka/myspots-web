
.PHONY: watch
watch:
	npx parcel src/index.html


.PHONY: mock
mock:
	cd api-mock && node server.js
