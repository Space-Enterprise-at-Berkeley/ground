import Box from "@material-ui/core/Box";

const componentMapping = {
  'column': (children, props) => <Box display={'flex'} flexDirection={'column'} {...props}>{children}</Box>,
  'full-screen-column': (children, props) => componentMapping.column(children, {
    style: {
      height: '100vh',
      width: '100vw'
    },
    ...props
  }),

}

module.exports = {
  componentMapping
}
