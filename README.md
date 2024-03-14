# Teoria de ReactQuery

## opciones:

refetchOnWindowFocus: Cuando sales de tu app y luego vuelves React Query vuelve hacer la petición de la data.

refetchOnMount: Cuando el componente se vuelve a montar entonces volverá a hacer la petición.

retry: Número de veces que se volverá a intentar la petición.

queryClient.invalidateQueries([key]) -> Esta linea de código, sirve para invalidar la cache y volver a pedir los datos al servidor. Es lo que normalmente quieres hacer cuando haces algún tipo de petición POST, PUT, DELETE, etc.

queryClient.setQueryData([key],
                (prevUsers: User[] | undefined) => prevUsers ? [user, ...prevUsers] : [user]
            ) -> setQueryData, necesita 2 parámetros, el primero es la queryKey para identificar que parte de la cache vas a obtener los datos y modificarlos.
El segundo parámetro es la función para establecer la nueva data. La cual debe recibir por parámetro, la data que ya esta en la cache, que en este caso puede ser un arreglo de usuarios o undefined.

![use query](/public/query.mhtml)