All Operations in the Elements Folder deal with:
- Directly Setting Element Attributes
- Setting Attributes & Parsing Element Attributes (when retrieving)
	- When Directly Setting Attributes, no operations should be performed on the value passed in
	- However, given a particular height and width, new attributes can be calculated
		- This is useful when resizing the selection

- Returning a full string representation of the element and all its attributes
- Retrieving derived values of the element (i.e. height, width, etc.)