alter table "public"."todos" drop constraint "todos_pkey";
alter table "public"."todos"
    add constraint "todos_pkey" 
    primary key ( "id" );
