package common

import (
	"log"

	"github.com/spf13/viper"
	"go.opentelemetry.io/otel/codes"
	"go.opentelemetry.io/otel/exporters/jaeger"
	semconv "go.opentelemetry.io/otel/semconv/v1.4.0"
	"go.opentelemetry.io/otel/trace"

	"go.opentelemetry.io/otel/sdk/resource"
	trace2 "go.opentelemetry.io/otel/sdk/trace"
)

func InitTracing() *trace2.TracerProvider {

	resource := resource.NewWithAttributes(
		semconv.SchemaURL,
		semconv.ServiceNameKey.String("idresearch_werbservice"),
	)

	log.Println("Init tracing")
	exp, err := jaeger.New(jaeger.WithCollectorEndpoint(jaeger.WithEndpoint(viper.GetString("jaeger.endpoint"))))
	if err != nil {
		log.Fatal(err)
	}
	tracingProvider := trace2.NewTracerProvider(
		trace2.WithBatcher(exp),
		trace2.WithResource(resource),
	)

	return tracingProvider
}

func TraceError(span trace.Span, err error) {
	defer span.End()
	span.RecordError(err)
	span.SetStatus(codes.Error, err.Error())
}
