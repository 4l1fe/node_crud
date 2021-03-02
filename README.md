# Notes

## Nodejs version

`14.16.0`

## DB 

Took the key-value embedded db `levelup` as a simple storage avoiding db administration and setting up. We keep a project minimalistic and implement features we need only extending it on demand.

## Curl testing commands

### Create

```
curl -X POST -F 'field=rec1' -F 'value=complete post' http://127.0.0.1:8080/todo
curl -X POST -F 'field=rec1' -F 'value=complete post' http://127.0.0.1:8080/todo
```

### Read

```
curl -X GET http://127.0.0.1:8080/todo
```

### Update

```
curl -X PUT -F 'field=rec2' -F 'value=complete post. uPDATED' http://127.0.0.1:8080/todo
curl -X GET http://127.0.0.1:8080/todo
```

### Delete

```
curl -X DELETE http://127.0.0.1:8080/todo/rec3
```

