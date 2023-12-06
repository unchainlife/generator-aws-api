BASE_DIR = api/<%=api%>/<%=resource%>/<%=method%>
FN_NAME = <%=api%>-<%=resource%>-<%=method%>

SRC_FILES = $(shell find $(BASE_DIR)/src/ -name '*.rs')

.PHONY = <%=api%>/<%=resource%>/<%=method%>:

$(BASE_DIR)/target/lambda/$(FN_NAME)/bootstrap.zip: $(SRC_FILES)
	cd $(BASE_DIR); \
	cargo lambda build --release --output-format binary ; \
	mkdir -p out; \
	cp target/lambda/<%=api%>_<%=resource%>_<%=method%>/* out/

$(BASE_DIR): $(BASE_DIR)/out/bootstrap
